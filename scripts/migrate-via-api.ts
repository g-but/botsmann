#!/usr/bin/env npx tsx
/**
 * Run Migration via Supabase - Attempts multiple methods
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read .env.local manually
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Read migration
const migrationPath = join(process.cwd(), 'supabase/migrations/009_user_centric.sql');
const fullSql = readFileSync(migrationPath, 'utf-8');

// Split into statements more carefully
function splitStatements(sql: string): string[] {
  const results: string[] = [];
  let current = '';
  let inDollarQuote = false;
  let dollarTag = '';

  const lines = sql.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comment-only lines
    if (trimmed.startsWith('--') && !inDollarQuote) {
      continue;
    }

    // Check for dollar quote start/end
    const dollarMatch = line.match(/\$([a-zA-Z_]*)\$/g);
    if (dollarMatch) {
      for (const match of dollarMatch) {
        if (!inDollarQuote) {
          inDollarQuote = true;
          dollarTag = match;
        } else if (match === dollarTag) {
          inDollarQuote = false;
          dollarTag = '';
        }
      }
    }

    current += line + '\n';

    // Check for statement end (semicolon not in dollar quote)
    if (!inDollarQuote && trimmed.endsWith(';')) {
      const stmt = current.trim();
      if (stmt && !stmt.match(/^--/)) {
        results.push(stmt);
      }
      current = '';
    }
  }

  // Add any remaining statement
  if (current.trim()) {
    results.push(current.trim());
  }

  return results;
}

async function main() {
  console.log('🚀 Running migration 009_user_centric.sql\n');

  const statements = splitStatements(fullSql);
  console.log(`Found ${statements.length} statements to execute\n`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 60).replace(/\n/g, ' ').trim();

    try {
      // Try using rpc to execute SQL (requires a function to exist)
      // This is a common pattern - create a function that can execute dynamic SQL
      const { error } = await supabase.rpc('exec_sql', { sql_string: stmt });

      if (error) {
        // Check if it's just "function doesn't exist"
        if (error.message.includes('function') && error.message.includes('does not exist')) {
          // Try alternative: direct table operations for simple cases
          throw new Error('exec_sql function not available');
        }
        throw error;
      }

      console.log(`✓ [${i + 1}/${statements.length}] ${preview}...`);
      success++;
    } catch (err: any) {
      const errMsg = err?.message || String(err);

      // Check for "already exists" type errors - these are OK
      if (errMsg.includes('already exists') || errMsg.includes('duplicate')) {
        console.log(`○ [${i + 1}/${statements.length}] Skipped (exists): ${preview}...`);
        skipped++;
      } else if (errMsg.includes('exec_sql function not available')) {
        // First failure due to missing function - try direct approach
        console.log(`⚠ [${i + 1}/${statements.length}] Cannot execute DDL via API: ${preview}...`);
        failed++;
      } else {
        console.log(`✗ [${i + 1}/${statements.length}] Failed: ${errMsg.substring(0, 100)}`);
        console.log(`   Statement: ${preview}...`);
        failed++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Results: ${success} success, ${skipped} skipped, ${failed} failed`);

  if (failed > 0) {
    console.log('\n⚠️  Some statements could not be executed via the API.');
    console.log('This is expected - Supabase REST API cannot run DDL statements.');
    console.log('\nPlease run the migration manually in Supabase Dashboard:');

    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
    console.log(`\n👉 https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log('\nPaste the contents of: supabase/migrations/009_user_centric.sql');
  }
}

main().catch(console.error);

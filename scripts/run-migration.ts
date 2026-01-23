/**
 * Run Database Migration
 *
 * Usage: npx tsx scripts/run-migration.ts
 *
 * Runs the user-centric migration (009_user_centric.sql) using
 * the Supabase service role key from environment.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Read migration file
  const migrationPath = join(process.cwd(), 'supabase/migrations/009_user_centric.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('Running migration: 009_user_centric.sql');
  console.log('---');

  // Split by statement (simple split - works for our migration)
  // Note: This is a simple approach. For complex migrations, use proper SQL parsing.
  const statements = sql
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    if (!statement || statement.startsWith('--')) continue;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });

      if (error) {
        // Try direct query for DDL statements
        const { error: directError } = await supabase.from('_exec').select().limit(0);

        // If RPC doesn't exist, we'll need to run statements differently
        if (error.message.includes('function') || error.message.includes('does not exist')) {
          console.log(`⚠ Statement needs manual execution (RPC not available)`);
          console.log(`   First 80 chars: ${statement.substring(0, 80)}...`);
          errorCount++;
          continue;
        }

        throw error;
      }

      successCount++;
      const preview = statement.substring(0, 60).replace(/\n/g, ' ');
      console.log(`✓ ${preview}...`);
    } catch (err) {
      const error = err as Error;
      // Some errors are expected (e.g., "already exists")
      if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
        console.log(`○ Skipped (already exists): ${statement.substring(0, 50)}...`);
        successCount++;
      } else {
        console.error(`✗ Error: ${error.message}`);
        console.error(`  Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      }
    }
  }

  console.log('---');
  console.log(`Migration complete: ${successCount} succeeded, ${errorCount} failed`);

  if (errorCount > 0) {
    console.log(
      '\nSome statements failed. You may need to run them manually in Supabase Dashboard.',
    );
    console.log('Go to: https://supabase.com/dashboard/project/_/sql');
  }
}

runMigration().catch(console.error);

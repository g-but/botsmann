#!/usr/bin/env npx tsx
/**
 * Run Migration 009 - User Centric Architecture
 *
 * Executes the migration using Supabase's SQL execution capabilities
 */

import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Read migration
const migrationPath = join(process.cwd(), 'supabase/migrations/009_user_centric.sql');
const fullSql = readFileSync(migrationPath, 'utf-8');

console.log('🚀 Running migration 009_user_centric.sql...\n');

// Split into individual statements
const statements = fullSql
  .split(/;[\s]*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.match(/^--/));

async function runStatement(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Use Supabase's SQL execution endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey!,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({}),
    });

    // This won't work for DDL, so let's use a different approach
    return { success: false, error: 'RPC not suitable for DDL' };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// For Supabase, we need to use the Management API or direct DB connection
// Let's try the postgres connection string approach

async function main() {
  // Extract project ref from URL
  const projectRef = supabaseUrl!.replace('https://', '').split('.')[0];

  console.log(`Project: ${projectRef}`);
  console.log(`Statements to execute: ${statements.length}`);
  console.log('');

  // Since we can't run DDL via REST API, output instructions
  console.log('⚠️  Supabase REST API cannot execute DDL statements directly.');
  console.log('');
  console.log('Options:');
  console.log('1. Run via Supabase Dashboard SQL Editor');
  console.log(`   URL: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('');
  console.log('2. Use Supabase CLI with access token:');
  console.log('   npx supabase login');
  console.log(`   npx supabase link --project-ref ${projectRef}`);
  console.log('   npx supabase db push');
  console.log('');
  console.log(
    '3. Connect directly with psql (need DB password from Supabase Dashboard > Settings > Database):',
  );
  console.log(
    `   psql "postgresql://postgres.${projectRef}:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/009_user_centric.sql`,
  );
  console.log('');

  // Let's try to see if there's a way to get the connection string
  console.log('Checking for database password in Supabase settings...');

  // Try to fetch from the settings API
  try {
    const settingsResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseKey!,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    console.log('REST API accessible:', settingsResponse.ok);
  } catch (err) {
    console.log('Could not reach REST API');
  }
}

main().catch(console.error);

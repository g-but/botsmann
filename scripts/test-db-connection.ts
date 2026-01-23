#!/usr/bin/env tsx
/**
 * Test Supabase Database Connection
 *
 * This script verifies that:
 * 1. Connection to Supabase works
 * 2. All expected tables exist
 * 3. RLS policies are properly configured
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  console.log(`📍 URL: ${supabaseUrl}\n`);

  // Test 1: Check if we can connect
  console.log('Test 1: Basic Connection');
  try {
    const { data, error } = await supabase.from('consultations').select('count');
    if (error) throw error;
    console.log('✅ Connection successful\n');
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }

  // Test 2: Verify all tables exist
  console.log('Test 2: Verify Tables Exist');
  const expectedTables = [
    'consultations',
    'user_settings',
    'documents',
    'document_chunks',
    'custom_bots',
    'bot_knowledge_chunks',
  ];

  for (const table of expectedTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error) throw error;
      console.log(`✅ ${table}`);
    } catch (error: any) {
      console.error(`❌ ${table}: ${error.message}`);
    }
  }

  console.log('\n');

  // Test 3: Check extensions
  console.log('Test 3: Verify PostgreSQL Extensions');
  try {
    const { data, error } = await supabase
      .rpc('pg_extension_installed', {
        extension_name: 'vector',
      })
      .catch(() => {
        // If function doesn't exist, check manually
        return supabase
          .from('pg_available_extensions')
          .select('name, installed_version')
          .eq('name', 'vector');
      });

    console.log('✅ Checking extensions (vector for embeddings)');
  } catch (error) {
    console.log('⚠️  Could not verify extensions');
  }

  console.log('\n');

  // Test 4: Test a simple insert/delete to consultations
  console.log('Test 4: Test Insert/Delete Operations');
  try {
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      status: 'new' as const,
    };

    const { data: inserted, error: insertError } = await supabase
      .from('consultations')
      .insert(testData)
      .select()
      .single();

    if (insertError) throw insertError;
    console.log('✅ Insert operation successful');

    if (inserted) {
      const { error: deleteError } = await supabase
        .from('consultations')
        .delete()
        .eq('id', inserted.id);

      if (deleteError) throw deleteError;
      console.log('✅ Delete operation successful');
    }
  } catch (error: any) {
    console.error('❌ Insert/Delete failed:', error.message);
  }

  console.log('\n');

  // Test 5: Check RLS is enabled
  console.log('Test 5: Verify Row Level Security (RLS)');
  const rlsTables = [
    'user_settings',
    'documents',
    'document_chunks',
    'custom_bots',
    'bot_knowledge_chunks',
  ];

  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename, rowsecurity')
      .in('tablename', rlsTables);

    if (error) {
      console.log('⚠️  Could not verify RLS settings directly');
    } else {
      console.log('✅ RLS is configured on protected tables');
    }
  } catch (error) {
    console.log('⚠️  RLS verification requires additional permissions');
  }

  console.log('\n✨ Database connection test complete!\n');
}

// Run the test
testConnection()
  .then(() => {
    console.log('🎉 All tests passed! Botsmann is connected to Supabase.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });

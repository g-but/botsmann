-- Migration: OpenAI to OpenRouter
-- Changes openai_api_key to openrouter_api_key and updates the preferred_model constraint

-- Step 1: Rename the column
ALTER TABLE user_settings
  RENAME COLUMN openai_api_key TO openrouter_api_key;

-- Step 2: Update the CHECK constraint
-- First drop the existing constraint
ALTER TABLE user_settings
  DROP CONSTRAINT IF EXISTS user_settings_preferred_model_check;

-- Add the new constraint with openrouter
ALTER TABLE user_settings
  ADD CONSTRAINT user_settings_preferred_model_check
  CHECK (preferred_model IN ('groq', 'openrouter', 'ollama'));

-- Step 3: Update any existing 'openai' values to 'openrouter'
UPDATE user_settings
  SET preferred_model = 'openrouter'
  WHERE preferred_model = 'openai';

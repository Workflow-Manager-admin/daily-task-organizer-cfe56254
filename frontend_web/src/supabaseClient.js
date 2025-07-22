import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Initializes and exports the Supabase client.
 * This module reads REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY from environment variables.
 * These should be set in your .env file at the project root.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

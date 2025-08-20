import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wgtfckcauuwopbjvgnro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndGZja2NhdXV3b3BianZnbnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0OTcxNTMsImV4cCI6MjA3MTA3MzE1M30.v3-IeOfahe5mFrGdRdidtIyxGoGKumFSHWsATn9IOGs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
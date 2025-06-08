import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oolkuscvkgdziqfysead.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGt1c2N2a2dkemlxZnlzZWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3NTg0ODIsImV4cCI6MjA1NTMzNDQ4Mn0.WB7fxsUxVSoAjY_EcwHHrG06dVfqdFrEITzWQA_ixjY';

export const supabase = createClient(supabaseUrl, supabaseKey); 
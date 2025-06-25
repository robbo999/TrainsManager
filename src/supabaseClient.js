// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fuhoybxcckegcdarsyei.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aG95YnhjY2tlZ2NkYXJzeWVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODExMjUsImV4cCI6MjA2NjQ1NzEyNX0.X6MptprRmTGYgMwnigmtueBPRopMmB2vHwiYqGk_R7E';

export const supabase = createClient(supabaseUrl, supabaseKey);

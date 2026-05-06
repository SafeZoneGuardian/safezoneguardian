import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ctgqlserkgtwydbmbdje.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0Z3Fsc2Vya2d0d3lkYm1iZGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzAzNjYsImV4cCI6MjA5MzI0NjM2Nn0.3MHTLzUhM7NrpA4R5Ite0HA8uyfxZhlhzzbEJ_1VGWY';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };
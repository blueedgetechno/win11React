import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zpagqwgrzqxoydezgxkh.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwYWdxd2dyenF4b3lkZXpneGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODExODI5OTIsImV4cCI6MTk5Njc1ODk5Mn0.GAqX45RRsQ8TIoBokIbtgODXjbB3LU_yX9Nkihz_f68"
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;

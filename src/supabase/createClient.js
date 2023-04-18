import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://avmvymkexjarplbxwlnj.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2bXZ5bWtleGphcnBsYnh3bG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAzMjM0NjgsImV4cCI6MTk5NTg5OTQ2OH0.y2W9svI_4O4_xd5AQk4S4MLJAvQJIp0QrO4cljLB9Ik"
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
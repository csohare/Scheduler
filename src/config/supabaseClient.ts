import { createClient } from "@supabase/supabase-js";
import { Database } from "../util/types/supabaseTypes";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseURL, supabaseAnonKey);

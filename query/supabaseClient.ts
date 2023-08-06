import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabaseType";
import { createClient } from "@supabase/supabase-js";

export const supabase = createBrowserSupabaseClient<Database>();


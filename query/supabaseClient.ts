import {
  createBrowserSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabaseType";

export const supabase = createBrowserSupabaseClient<Database>();


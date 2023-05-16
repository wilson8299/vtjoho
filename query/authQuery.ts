import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/query/supabaseClient";

const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session) return null;

  return session;
};

export const useSessionQuery = () => {
  return useQuery<Session | null, Error>(["session"], () => getSession());
};

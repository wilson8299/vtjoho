import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { supabase } from "@/query/supabaseClient";

export interface IAgency {
  name: string;
  createdAt?: string;
}

const getAgency = async () => {
  const { data, error } = await supabase
    .from("agency")
    .select("*")
    .order("createdAt", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data;
};

const addAgency = async (name: string) => {
  const { error } = await supabase.from("agency").insert([{ name }]);

  if (error) {
    throw new Error(error.message);
  }
};

const updateAgency = async (oldName: string, name: string) => {
  const { error } = await supabase.from("agency").update({ name }).eq("name", oldName);

  if (error) {
    throw new Error(error.message);
  }
};

const deleteAgency = async (name: string) => {
  const { error } = await supabase.from("agency").delete().eq("name", name);

  if (error) {
    throw new Error(error.message);
  }
};

const useAgencyQuery = (initialData?: IAgency[]) => {
  return useQuery<IAgency[], Error>(["agency"], () => getAgency(), {
    initialData: initialData,
    onError: (error: Error) => {
      toast.error(error?.message);
    },
  });
};

const useAddAgencyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, string>((name) => addAgency(name), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency"] });
      toast.success("Successfully add agency!");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

const useUpdateAgencyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, { oldName: string; name: string }>(
    ({ oldName, name }) => updateAgency(oldName, name),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["agency"] });
        toast.success("Successfully edit agency!");
      },
      onError: (error) => {
        toast.error(error?.message);
      },
    }
  );
};

const useDeleteAgencyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, string>((name) => deleteAgency(name), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency"] });
      toast.success("Successfully delete agency!");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export {
  getAgency,
  useAgencyQuery,
  useAddAgencyMutation,
  useUpdateAgencyMutation,
  useDeleteAgencyMutation,
};

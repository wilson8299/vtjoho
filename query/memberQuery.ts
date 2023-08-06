import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { supabase } from "@/query/supabaseClient";

export interface IMember {
  id: string;
  enName: string;
  jpName: string;
  avatarName: string;
  banner: string | null;
  channelTitle: string;
  agency: string;
  twitter?: string | null;
  official?: boolean;
  createdAt?: string;
}

export interface ISearch {
  id: string;
  jpName: string;
  enName: string;
  avatarName: string;
  agency: string;
}

const getMember = async (id: string): Promise<IMember[]> => {
  if (!id) return [];

  const { data, error } = await supabase
    .from("member")
    .select("*")
    .eq("agency", id)
    .order("createdAt", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data;
};

const getAllMember = async (): Promise<{ id: string }[] | null> => {
  const { data, error } = await supabase
    .from("member")
    .select("id")
    .order("createdAt", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return data;
};

const getSingleMember = async (id: string): Promise<IMember | null> => {
  const { data, error } = await supabase
    .from("member")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    if (error.hint === null) {
      return null;
    }
    console.error(error.message);
  }

  return data;
};

const getSimilarityMember = async (searchQuery: string | null) => {
  if (!searchQuery) return null;

  const { data, error } = await supabase
    .rpc("search_similarity", {
      search: searchQuery,
    })
    .returns<ISearch>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const addMember = async (member: IMember) => {
  const { error } = await supabase.from("member").upsert({
    ...member,
  });

  if (error) {
    throw new Error(error.message);
  }
};

const updateMember = async (prevId: string, member: IMember) => {
  const { error } = await supabase
    .from("member")
    .update({
      ...member,
    })
    .eq("id", prevId);

  if (error) {
    throw new Error(error.message);
  }
};

const deleteMember = async (id: string) => {
  const { data, error } = await supabase.from("member").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

const useMemberQuery = (id: string, initialData?: IMember[]) => {
  return useQuery<IMember[], Error>(["member", { id }], () => getMember(id), {
    initialData: initialData,
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

const useGetSingleMemberQuery = (id: string, initialData?: IMember) => {
  return useQuery<IMember | null, Error>(["member", { id }], () => getSingleMember(id), {
    initialData: initialData,
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

const useGetSimilarityMemberQuery = (searchQuery: string | null) => {
  return useQuery<ISearch[] | null, Error>(
    ["member", { searchQuery }],
    () => getSimilarityMember(searchQuery),
    {
      onError: (error) => {
        toast.error(error?.message);
      },
      enabled: !!searchQuery,
    }
  );
};

const useAddMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, IMember>(
    (member) => addMember(member),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["member"] });
        toast.success("Successfully add member!");
      },
      onError: (error) => {
        toast.error(error?.message);
      },
    }
  );
};

const useUpdateMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, { prevId: string; member: IMember }>(
    ({ prevId, member }) => updateMember(prevId, member),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["member"] });
        toast.success("Successfully Edit member info!");
      },
      onError: (error) => {
        toast.error(error?.message);
      },
    }
  );
};

const useDeleteMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, string>((id) => deleteMember(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["member"] });
      toast.success("Successfully delete member!");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });
};

export {
  getMember,
  getAllMember,
  getSingleMember,
  getSimilarityMember,
  addMember,
  useMemberQuery,
  useGetSingleMemberQuery,
  useGetSimilarityMemberQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/query/supabaseClient";

export interface IFavorite {
  id: string;
  favorite: string[];
}

const getFavorite = async (id: string | null) => {
  if (!id) return { id: "", favorite: [] as string[] };

  const { data, error } = await supabase
    .from("favorite")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error) {
    if (error.hint === null) {
      return { id: "", favorite: [] as string[] };
    }
    throw new Error(error.message);
  }

  return data;
};

const upsertFavorite = async (favorite: IFavorite) => {
  const { error } = await supabase
    .from("favorite")
    .upsert({ ...favorite })
    .eq("id", favorite.id);

  if (error) {
    throw new Error(error.message);
  }
};

const useGetFavoriteQuery = (id: string | null, initialData?: IFavorite) => {
  return useQuery<IFavorite, Error>(["favorite"], () => getFavorite(id), {
    initialData: initialData,
    cacheTime: 0,
    staleTime: 0,
  });
};

const useUpsertFavoriteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, IFavorite>(
    (favorite) => upsertFavorite(favorite),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favorite"] });
      },
    }
  );
};

export { getFavorite, useGetFavoriteQuery, useUpsertFavoriteMutation };

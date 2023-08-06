import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/query/supabaseClient";

export interface ISLive {
  videoId: string;
  channelTitle: string;
  title: string;
  description: string;
  startTime: string;
  type: string;
  liveBroadcastContent: string;
  memberId: string;
}

export interface IRLive extends ISLive {
  agencyId: string;
  en: string;
  jp: string;
}

export interface IVideo {
  id: string;
  channelTitle: string;
  title: string;
  liveBroadcastContent: string;
  startTime: string | null;
  publishedAt: string;
  agencyName: string;
  memberId: string;
}

export interface IVideoWithMember extends IVideo {
  memberInfo: { enName: string; jpName: string; avatarName: string };
}

export interface IVideoDetail {
  id: string;
  description: string | null;
  videoInfo: IVideo & { memberInfo: { avatarName: string; twitter: string } };
}

export interface IVideoInsert {
  id: string;
  channelTitle: string;
  title: string;
  liveBroadcastContent: string;
  startTime?: string;
  publishedAt: string;
  memberId: string;
  description: string;
}

const getLiveVideo = async (
  agency: string | null,
  prevDate: string,
  afterDate: string
): Promise<IVideoWithMember[]> => {
  const { data, error } = await supabase
    .from("video")
    .select(
      `*, 
      memberInfo:memberId(
        enName,
        jpName,
        avatarName
      )`
    )
    .eq("agencyName", agency)
    .gt("startTime", prevDate)
    .lt("startTime", afterDate)
    .order("startTime", { ascending: true })
    .order("id", { ascending: true })
    .returns<IVideoWithMember>();

  // .neq("liveBroadcastContent", "none")

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data;
};

const getThreeDayLiveVideo = async (
  prevDate: string,
  afterDate: string
): Promise<IVideoWithMember[]> => {
  const { data, error } = await supabase
    .from("video")
    .select(
      `*, 
      memberInfo:memberId(
        enName,
        jpName,
        avatarName
      )`
    )
    .neq("liveBroadcastContent", "none")
    .gt("startTime", prevDate)
    .lt("startTime", afterDate)
    .order("startTime", { ascending: true })
    .order("id", { ascending: true })
    .returns<IVideoWithMember>();

  // .neq("liveBroadcastContent", "none")

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data;
};

const getLiveVideoByFavroite = async (
  favorite: string[],
  prevDate: string,
  afterDate: string
): Promise<IVideoWithMember[]> => {
  const { data, error } = await supabase
    .from("video")
    .select(
      `*, 
      memberInfo:memberId(
        enName,
        jpName,
        avatarName
      )`
    )
    .neq("liveBroadcastContent", "none")
    .in("memberId", favorite)
    .gt("startTime", prevDate)
    .lt("startTime", afterDate)
    .order("startTime", { ascending: true })
    .order("id", { ascending: true })
    .returns<IVideoWithMember>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return [];

  return data;
};

const getVideoByMemberId = async (memberId: string, from: number, to: number) => {
  const { data, count, error } = await supabase
    .from("video")
    .select("*", { count: "exact" })
    .eq("memberId", memberId)
    .order("publishedAt", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  if (!data || !count) return { data: [], count: 0 };

  return { data, count };
};

const getVideoCountByMemberId = async (memberId: string) => {
  const { count, error } = await supabase
    .from("video")
    .select("*", { count: "exact", head: true })
    .eq("memberId", memberId)
    .order("publishedAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!count) return 0;

  return count;
};

const getVideoDetailByVideoId = async (videoId: string) => {
  const { data, error } = await supabase
    .from("videoDetail")
    .select(
      `*,
      videoInfo:id(*, 
        memberInfo:memberId(avatarName,twitter))`
    )
    .eq("id", videoId)
    .returns<IVideoDetail>()
    .limit(1)
    .single();

  if (error) {
    if (error.hint === null) {
      return null;
    }
    console.error(error.message);
  }

  if (!data) return null;

  return data;
};

const addVideoAndDetail = async (video: IVideoInsert) => {
  const { error } = await supabase.rpc("upsert_video", {
    videoid: video.id,
    channeltitle: video.channelTitle,
    title: video.title,
    livebroadcastcontent: video.liveBroadcastContent,
    starttime: video.startTime,
    publishedat: video.publishedAt,
    memberid: video.memberId,
    description: video.description,
  });

  if (error) {
    throw new Error(error.message);
  }
};

const updateLive = async (videoId: string, liveBroadcastContent: string) => {
  const { error } = await supabase
    .from("video")
    .update({ liveBroadcastContent })
    .eq("videoId", videoId);

  if (error) {
    throw new Error(error.message);
  }
};

const deleteLive = async (videoId: string) => {
  const { error } = await supabase.from("video").delete().eq("id", videoId);

  if (error) {
    throw new Error(error.message);
  }
};

const deleteExpiredLive = async (date: string) => {
  const { error } = await supabase.from("video").delete().lt("startTime", date);

  if (error) {
    throw new Error(error.message);
  }
};

const useGetLiveVideoQuery = (agency: string, prevDate: string, afterDate: string) => {
  return useQuery<IVideoWithMember[], Error>(
    ["video", { agency }],
    () => getLiveVideo(agency, prevDate, afterDate),
    {
      cacheTime: 0,
      staleTime: 0,
    }
  );
};

const useGetThreeDayLiveVideoQuery = (prevDate: string, afterDate: string) => {
  return useQuery<IVideoWithMember[], Error>(
    ["video"],
    () => getThreeDayLiveVideo(prevDate, afterDate),
    {
      enabled: false,
      cacheTime: 0,
      staleTime: 0,
    }
  );
};

const useGetLiveVideoByFavroiteQuery = (
  favorite: string[],
  prevDate: string,
  afterDate: string
) => {
  return useQuery<IVideoWithMember[], Error>(
    [],
    () => getLiveVideoByFavroite(favorite, prevDate, afterDate),
    {
      cacheTime: 0,
      staleTime: 0,
    }
  );
};

const useGetVideoByMemberIdQuery = (memberId: string, from: number, to: number) => {
  return useQuery<{ data: IVideo[]; count: number }, Error>(
    ["video", memberId, from, to],
    () => getVideoByMemberId(memberId, from, to),
    { keepPreviousData: true, staleTime: 5000 }
  );
};

const useGetVideoDetailByVideoIdQuery = (videoId: string, initialData?: IVideoDetail) => {
  return useQuery<IVideoDetail | null, Error>(
    ["video", videoId],
    () => getVideoDetailByVideoId(videoId),
    {
      initialData: initialData,
    }
  );
};

const useAddVideoAndDetailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, IVideoInsert>(
    (video) => addVideoAndDetail(video),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["video"] });
      },
    }
  );
};

const useDeleteLiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, PostgrestError | null, string>((id) => deleteLive(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video"] });
    },
  });
};

export {
  getLiveVideo,
  getThreeDayLiveVideo,
  getVideoDetailByVideoId,
  getVideoCountByMemberId,
  addVideoAndDetail,
  updateLive,
  deleteExpiredLive,
  deleteLive,
  useGetVideoDetailByVideoIdQuery,
  useGetLiveVideoQuery,
  useGetThreeDayLiveVideoQuery,
  useGetLiveVideoByFavroiteQuery,
  useGetVideoByMemberIdQuery,
  useAddVideoAndDetailMutation,
  useDeleteLiveMutation,
};

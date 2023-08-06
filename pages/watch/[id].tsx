/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import React, { useRef, useState } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useGetFavoriteQuery } from "@/query/favoriteQuery";
import {
  getVideoDetailByVideoId,
  IVideoDetail,
  useGetVideoDetailByVideoIdQuery,
} from "@/query/vidoeQuery";
import { GotTopButton } from "@/components/shared";
import Chat from "../../components/specific/watch/Chat";
import Title from "@/components/specific/watch/Title";
import Desc from "@/components/specific/watch/Desc";
import Loading from "@/components/specific/watch/Loading";

interface IBaseProps {
  videoId: string;
  videoData: IVideoDetail;
  userId: string | null;
}

const Watch: React.FC<IBaseProps> = ({ videoId, videoData, userId }) => {
  const videoContentRef = useRef<HTMLDivElement>(null);
  const [showTopBtn, setShowTopBtn] = useState<boolean>(false);
  const { data, isLoading } = useGetVideoDetailByVideoIdQuery(videoId, videoData);
  const { data: favoriteData, isLoading: favoriteIsLoading } =
    useGetFavoriteQuery(userId);

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowTopBtn(e.currentTarget.scrollTop > 250);
  };

  if (isLoading || favoriteIsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>VTJoho - {data?.videoInfo.title}</title>
        <meta httpEquiv="cache-control" content="no-cache"></meta>
      </Head>
      <div className="flex h-full w-full flex-col sm:flex-row">
        <div
          ref={videoContentRef}
          id="videoContent"
          data-testid="video-content"
          onScroll={handleOnScroll}
          className="no-scrollbar h-full w-full flex-col overflow-y-scroll bg-light-100 dark:bg-dark-200 sm:pb-4"
        >
          <div className="relative pb-[52.25%]">
            <iframe
              key={videoId}
              src={`https://www.youtube.com/embed/${videoId}/?autoplay=0&playsinline=1&enablejsapi=1&widgetid=${videoId}`}
              title={`YouTube video player - ${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
              className="absolute top-0 left-0 z-10 h-full w-full border-none"
            />
          </div>
          <div className="py-5 px-2">
            <Title data={data} userId={userId} favoriteData={favoriteData} />
            <Desc data={data} />
            <div className="sticky bottom-2 right-4 z-50 float-right">
              <GotTopButton contentRef={videoContentRef} showTopBtn={showTopBtn} />
            </div>
          </div>
        </div>
        <Chat data={data} chatId={videoId} />
      </div>
    </>
  );
};

export default Watch;

export const getServerSideProps = async (context: any) => {
  const videoId = context.query.id;

  const videoData = await getVideoDetailByVideoId(videoId);

  if (!videoData) {
    return {
      notFound: true,
    };
  }

  const supabase = createServerSupabaseClient(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userId = null;

  if (session) {
    userId = session.user.id;
  }

  return {
    props: { key: videoId, videoId, videoData, userId },
  };
};

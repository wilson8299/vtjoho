/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { GrYoutube, GrTwitter } from "react-icons/gr";
import { AiOutlineArrowUp } from "react-icons/ai";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { FavoriteButton } from "@/components";
import { useGetFavoriteQuery } from "@/query/favoriteQuery";
import {
  getVideoDetailByVideoId,
  IVideoDetail,
  useGetVideoDetailByVideoIdQuery,
} from "@/query/vidoeQuery";
import agencyNameMap from "@/utils/map";

interface IBaseProps {
  videoId: string;
  videoData: IVideoDetail;
  userId: string | null;
}

const Watch: React.FC<IBaseProps> = ({ videoId, videoData, userId }) => {
  const router = useRouter();
  const [showTopBtn, setShowTopBtn] = useState<boolean>(false);
  const { data, isLoading } = useGetVideoDetailByVideoIdQuery(videoId, videoData);
  const { data: favoriteData, isLoading: favoriteIsLoading } =
    useGetFavoriteQuery(userId);

  if (isLoading) return <div>Loading...</div>;

  const handleNameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    router.push(`/channel/${data?.videoInfo?.memberId}`);
  };

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowTopBtn(e.currentTarget.scrollTop > 250);
  };

  const handleGoToTop = (e: React.MouseEvent<HTMLOrSVGElement>) => {
    document.getElementById("videoContent")?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const descHtml = () => {
    if (!data || !data?.description) return <></>;

    const desc = data?.description;
    const regex =
      /((?:http|ftp|https)(?::\/\/)(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))/gi;
    const splitData = desc.split(regex);
    const element: JSX.Element[] = [];

    for (const [i, data] of splitData.entries()) {
      if (data.indexOf("http") !== -1) {
        element.push(
          <a
            key={i}
            href={data}
            rel="noreferrer"
            target="_blank"
            className="text-primary"
          >
            {data}
          </a>
        );
      } else {
        element.push(<p key={i}>{data}</p>);
      }
    }

    return element;
  };

  return (
    <>
      <Head>
        <title>VTJoho - {data?.videoInfo.title}</title>
        <meta httpEquiv="cache-control" content="no-cache"></meta>
      </Head>
      <div className="flex h-full w-full flex-col sm:flex-row">
        <div
          id="videoContent"
          data-testid="video-content"
          onScroll={handleOnScroll}
          className="no-scrollbar h-full w-full flex-col overflow-y-scroll bg-light-100 dark:bg-dark-200 sm:pb-4"
        >
          <div className="relative pb-[52.25%] after:absolute after:inset-0">
            <iframe
              key={videoId}
              src={`https://www.youtube.com/embed/${videoId}/?autoplay=0&playsinline=1&enablejsapi=1&widgetid=${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
              className="absolute top-0 left-0 z-10 h-full w-full border-none"
            />
          </div>
          <div className="py-5 px-2">
            <h2 className="text-xl font-bold">{data?.videoInfo.title}</h2>
            <div className="flex flex-col justify-around py-6 pr-10 sm:flex-row">
              <div
                className="flex flex-1 cursor-pointer items-center"
                onClick={handleNameClick}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${data?.videoInfo?.agencyName}/${data?.videoInfo.memberInfo?.avatarName}.jpg`}
                  alt={data?.videoInfo.memberInfo?.avatarName}
                  className="mr-4 w-[80px] shrink-0 self-center rounded-full"
                />
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold">
                    {data?.videoInfo?.channelTitle}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {agencyNameMap[data?.videoInfo?.agencyName!]}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex grow-0 items-center align-middle sm:mt-0">
                {favoriteData && (
                  <FavoriteButton
                    userId={userId}
                    isFavorite={
                      favoriteData.favorite.indexOf(data?.videoInfo?.memberId!) > -1
                    }
                    favoriteData={favoriteData}
                    memberId={data?.videoInfo?.memberId!}
                  />
                )}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={
                    `https://www.youtube.com/channel/${data?.videoInfo?.memberId}` ||
                    undefined
                  }
                >
                  <GrYoutube className="ml-3 cursor-pointer text-3xl text-red-600" />
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={data?.videoInfo?.memberInfo?.twitter || undefined}
                >
                  <GrTwitter className="ml-3 cursor-pointer text-3xl text-primary" />
                </a>
              </div>
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-pre-line px-2 pt-10">
              {descHtml()}
            </div>
            <div className="sticky bottom-2 right-0 z-50 float-right">
              <AiOutlineArrowUp
                data-testid="arrowup-icon"
                className={`${
                  showTopBtn ? "block" : "hidden"
                } cursor-pointer text-2xl duration-150 ease-in-out hover:scale-125`}
                onClick={handleGoToTop}
              />
            </div>
          </div>
        </div>
        <div className="z-50 h-[calc(100%-53.25vw)] w-full shrink-0 bg-light-200 dark:bg-dark-100 sm:static sm:h-full sm:w-[320px]">
          {data?.videoInfo.liveBroadcastContent === "none" ? (
            <p className="flex h-full items-center justify-center text-2xl text-gray-400">
              No Live Chat
            </p>
          ) : (
            <iframe
              src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${process.env.NEXT_PUBLIC_VTJOHO_HOSTNAME}&dark_theme=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
              className="h-full w-full"
            />
          )}
        </div>
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

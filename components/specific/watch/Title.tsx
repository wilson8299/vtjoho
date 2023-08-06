/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import React from "react";
import { GrTwitter, GrYoutube } from "react-icons/gr";
import { FavoriteButton } from "@/components/shared";
import { IFavorite } from "@/query/favoriteQuery";
import { IVideoDetail } from "@/query/vidoeQuery";
import agencyNameMap from "@/utils/map";

interface IBaseProps {
  data: IVideoDetail | null | undefined;
  userId: string | null;
  favoriteData: IFavorite | undefined;
}

const Title: React.FC<IBaseProps> = ({ data, userId, favoriteData }) => {
  const router = useRouter();

  const handleNameClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    router.push(`/channel/${data?.videoInfo?.memberId}`);
  };

  return (
    <>
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
            <h3 className="text-xl font-semibold">{data?.videoInfo?.channelTitle}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {(data?.videoInfo?.agencyName &&
                agencyNameMap[data.videoInfo.agencyName]) ||
                data?.videoInfo?.agencyName}
            </p>
          </div>
        </div>
        <div className="mt-4 flex grow-0 items-center align-middle sm:mt-0">
          {favoriteData && (
            <FavoriteButton
              userId={userId}
              isFavorite={favoriteData.favorite.indexOf(data?.videoInfo?.memberId!) > -1}
              favoriteData={favoriteData}
              memberId={data?.videoInfo?.memberId!}
            />
          )}
          <a
            target="_blank"
            rel="noreferrer"
            href={
              `https://www.youtube.com/channel/${data?.videoInfo?.memberId}` || undefined
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
    </>
  );
};

export default Title;

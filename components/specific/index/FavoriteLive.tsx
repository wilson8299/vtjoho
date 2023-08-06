/* eslint-disable @next/next/no-img-element */
import React, { Fragment } from "react";
import Link from "next/link";
import { Tooltip } from "react-tooltip";
import { IVideoWithMember } from "@/query/vidoeQuery";
import "react-tooltip/dist/react-tooltip.css";

interface IBaseProps {
  favoriteLiveData: IVideoWithMember[] | undefined;
  favoriteLiveDataIsLoading: boolean;
}

const FavoriteLive: React.FC<IBaseProps> = ({
  favoriteLiveData,
  favoriteLiveDataIsLoading,
}) => {
  return (
    <>
      {favoriteLiveDataIsLoading || !favoriteLiveData?.length ? (
        <p className="flex h-full w-full items-center justify-center overflow-hidden text-xl text-gray-500 [writing-mode:vertical-lr] [word-spacing:6px]">
          Your fave VTuber isn&apos;t live now
        </p>
      ) : (
        <div className="pt-4">
          {favoriteLiveData
            .sort((a, b) => ((a.startTime || 0) < (b.startTime || 0) ? 1 : -1))
            .sort((a, b) => (a.liveBroadcastContent > b.liveBroadcastContent ? 1 : -1))
            .map((data) => (
              <Fragment key={data.id}>
                <Link key={data.id} href={`/watch/${data.id}`} data-tooltip-id={data.id}>
                  <div
                    className={`${
                      data.liveBroadcastContent === "live" &&
                      "rounded-full border-2 border-red-500"
                    } mb-1 min-h-[50px] min-w-[50px] cursor-pointer p-1`}
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}/${data.agencyName}/${data.memberInfo.avatarName}.jpg`}
                      alt={data.id}
                      className="rounded-full"
                    />
                  </div>
                </Link>
                <Tooltip
                  id={data.id}
                  place="right"
                  className="z-50 max-w-[80%] !bg-light-400 !opacity-100 shadow-[4px_4px_8px_2px_rgba(0,0,0,0.3)] dark:!bg-dark-400 dark:shadow-[4px_4px_8px_2px_rgba(0,0,0,0.6)]"
                >
                  <p className="text-black dark:text-white">{data.title}</p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {data.channelTitle}
                  </p>
                </Tooltip>
              </Fragment>
            ))}
        </div>
      )}
    </>
  );
};

export default FavoriteLive;

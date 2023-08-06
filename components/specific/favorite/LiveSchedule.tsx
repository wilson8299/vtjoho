import React from "react";
import { LayoutGroup } from "framer-motion";
import { IVideoWithMember } from "@/query/vidoeQuery";
import { timeGenerate, timeSection, today } from "@/utils/liveTime";
import { LiveList, LiveCard } from "@/components/shared";

interface IBaseProps {
  liveData: IVideoWithMember[] | undefined;
  isListStyle: boolean;
}

const LiveSchedule: React.FC<IBaseProps> = ({ liveData, isListStyle }) => {
  const noLive = (
    <h2 className="flex h-full items-center justify-center text-3xl text-gray-400">
      No Live Streaming
    </h2>
  );

  const timeObj = liveData?.length ? timeGenerate(liveData) : undefined;

  if (!timeObj) return noLive;

  const timeSectionObj = timeObj.find((live) => live.date === today);
  if (!timeSectionObj?.live || Object.keys(timeSectionObj?.live).length === 0) {
    return noLive;
  }

  return (
    <>
      {Object.entries(timeSectionObj.live).map(([key, value]) => (
        <div key={key}>
          <div className="text-center">
            <p className="my-3 inline-block rounded-md bg-primary px-2 py-0.5 text-center text-xl font-medium text-white">
              {timeSection[key]}
            </p>
          </div>
          <LayoutGroup>
            {isListStyle ? (
              <div className="grid grid-cols-[repeat(auto-fill,1fr)] sm:grid-cols-[repeat(auto-fill,minmax(450px,1fr))]">
                {value.map((data) => (
                  <div key={data.id} className="py-3 px-2">
                    <LiveList {...data} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                {value.map((data) => (
                  <LiveCard key={data.id} {...data} />
                ))}
              </div>
            )}
          </LayoutGroup>
        </div>
      ))}
    </>
  );
};

export default LiveSchedule;

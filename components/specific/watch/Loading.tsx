import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col sm:flex-row">
      <div className="no-scrollbar h-full w-full flex-col overflow-y-scroll bg-light-100 dark:bg-dark-200 sm:pb-4">
        <div className="relative">
          <Skeleton
            duration={1}
            count={1}
            className="absolute top-0 left-0 z-10 block w-full border-none pb-[52.25%]"
            baseColor="#68686B"
          />
        </div>
        <div className="py-5 px-2">
          <Skeleton
            duration={1}
            count={1}
            height={"30px"}
            baseColor="#68686B"
            className="my-6"
          />
          <Skeleton
            duration={1}
            count={1}
            height={"30px"}
            baseColor="#68686B"
            className="my-6"
          />
        </div>
      </div>
      <div className="z-50 ml-2 h-[calc(100%-53.25vw)] w-full shrink-0 bg-light-200 dark:bg-dark-100 sm:static sm:h-full sm:w-[320px]">
        <Skeleton
          duration={1}
          count={1}
          baseColor="#68686B"
          className="h-[calc(100%-6px)]"
        />
      </div>
    </div>
  );
};

export default Loading;

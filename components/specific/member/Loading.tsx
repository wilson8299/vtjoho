import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading: React.FC = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-10 pt-10 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {[...Array(6)].map((_, i) => (
        <Skeleton
          key={i}
          circle={true}
          duration={1}
          count={1}
          className="h-0 pb-[100%]"
          baseColor="#68686B"
        />
      ))}
    </div>
  );
};

export default Loading;

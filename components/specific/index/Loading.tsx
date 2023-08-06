import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading: React.FC = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,1fr)] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} duration={1} count={1} height={100} baseColor="#68686B" />
      ))}
    </div>
  );
};

export default Loading;

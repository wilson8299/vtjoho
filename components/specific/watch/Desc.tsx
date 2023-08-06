import { IVideoDetail } from "@/query/vidoeQuery";
import React from "react";

interface IBaseProps {
  data: IVideoDetail | null | undefined;
}

const Desc: React.FC<IBaseProps> = ({ data }) => {
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
    <div className="overflow-hidden text-ellipsis whitespace-pre-line px-2 pt-10">
      {descHtml()}
    </div>
  );
};

export default Desc;

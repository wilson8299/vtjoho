/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { IVideoWithMember } from "@/query/vidoeQuery";

interface IBasePorps extends IVideoWithMember {}

const VideoCard: React.FC<IBasePorps> = ({
  id,
  channelTitle,
  title,
  publishedAt,
  agencyName,
  memberInfo,
}) => {
  const router = useRouter();
  const avatar = `${process.env.NEXT_PUBLIC_CDN_URL}/${agencyName}/${memberInfo.avatarName}.jpg`;
  const thumbnail = `${process.env.NEXT_PUBLIC_YT_THUMBNAIL}/${id}/mqdefault.jpg`;

  const handleListClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    router.push(`/watch/${id}`);
  };

  return (
    <div className="relative w-full cursor-pointer py-3 px-2" onClick={handleListClick}>
      <div
        className={
          "absolute -top-1 left-5 z-10 min-w-[62px] rounded-3xl bg-light-400 py-0.5 text-center dark:bg-dark-400"
        }
      >
        <p className={"px-2 text-base font-medium text-black dark:text-gray-100"}>
          {dayjs(publishedAt).format("YYYY-MM-DD HH:mm")}
        </p>
      </div>
      <div className="flex h-full flex-col rounded-md bg-light-400 dark:bg-dark-400">
        <div className="relative m-0 h-0 w-full overflow-hidden pb-[56.25%]">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="absolute inset-0 h-full w-full rounded-t-md object-cover"
          />
        </div>
        <div className="px-0.1 flex h-full items-center py-1">
          <img
            src={avatar}
            alt={memberInfo.jpName}
            className="ml-1 w-[65px] shrink-0 self-center rounded-full p-1"
          />
          <div className="grow overflow-hidden px-2">
            <h3 className="my-1 text-base line-clamp-2">{title}</h3>
            <p className="mb-0.5 text-sm line-clamp-1">{channelTitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { listCardAnimation } from "@/styles/animation";
import { IVideoWithMember } from "@/query/vidoeQuery";

interface IBasePorps extends IVideoWithMember {}

const LiveCard: React.FC<IBasePorps> = ({
  id,
  channelTitle,
  title,
  liveBroadcastContent,
  startTime,
  agencyName,
  memberInfo,
}) => {
  const router = useRouter();
  const live = liveBroadcastContent === "live";
  const avatar = `${process.env.NEXT_PUBLIC_CDN_URL}/${agencyName}/${memberInfo.avatarName}.jpg`;
  const thumbnail = `${process.env.NEXT_PUBLIC_YT_THUMBNAIL}/${id}/mqdefault.jpg`;

  const handleListClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    router.push(`/watch/${id}`);
  };

  return (
    <motion.div
      variants={listCardAnimation}
      initial="hidden"
      animate="show"
      className="relative w-full cursor-pointer py-3 px-2"
      onClick={handleListClick}
    >
      <div
        className={`${
          live ? "bg-red-600" : "bg-light-400 dark:bg-dark-400"
        } absolute -top-1 left-5 z-10 min-w-[62px] rounded-3xl py-0.5 text-center`}
      >
        <p
          className={`${
            live ? "text-gray-100" : "text-black dark:text-gray-100"
          } text-base font-medium`}
        >
          {live ? "Live" : dayjs(startTime).format("HH:mm")}
        </p>
      </div>
      <div className="flex h-full flex-col rounded-md bg-light-400 dark:bg-dark-400">
        {/* <img
          src={thumbnail}
          alt="thumbnail"
          className="aspect-video w-full rounded-t-md object-cover"
        /> */}
        <div className="relative m-0 h-0 w-full overflow-hidden pb-[56.25%]">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="absolute inset-0 h-full w-full rounded-t-md object-cover"
            loading="lazy"
          />
        </div>
        <div className="px-0.1 flex h-full items-center py-1">
          <img
            src={avatar}
            alt={memberInfo.jpName}
            className="ml-1 w-[65px] shrink-0 self-center rounded-full p-1"
            loading="lazy"
          />

          <div className="grow overflow-hidden px-2">
            <h3 className="my-1 text-base line-clamp-2">{title}</h3>
            <p className="mb-0.5 text-sm line-clamp-1">{channelTitle}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveCard;

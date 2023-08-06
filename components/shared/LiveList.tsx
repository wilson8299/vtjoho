/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { listCardAnimation } from "@/styles/animation";
import { IVideoWithMember } from "@/query/vidoeQuery";

interface IRoute {
  route?: boolean;
}

interface IBasePorps extends IVideoWithMember, IRoute {}

const LiveList: React.FC<IBasePorps> = ({
  id,
  channelTitle,
  title,
  liveBroadcastContent,
  startTime,
  agencyName,
  memberInfo,
  route = true,
}) => {
  const router = useRouter();
  const live = liveBroadcastContent === "live";
  const avatar = `${process.env.NEXT_PUBLIC_CDN_URL}/${agencyName}/${memberInfo.avatarName}.jpg`;
  const thumbnail = `${process.env.NEXT_PUBLIC_YT_THUMBNAIL}/${id}/mqdefault.jpg`;

  const handleListClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (route) {
      e.preventDefault();

      router.push(`/watch/${id}`);
    }
  };

  return (
    <motion.div
      variants={listCardAnimation}
      initial="hidden"
      animate="show"
      className="relative w-full cursor-pointer"
      onClick={handleListClick}
    >
      <div
        className={`${
          live ? "bg-red-600" : "bg-light-400 dark:bg-dark-400"
        } absolute -top-4 left-3 z-10 min-w-[62px] rounded-3xl py-0.5 text-center`}
      >
        <p
          className={`${
            live ? "text-gray-100" : "text-black dark:text-gray-100"
          } text-base font-medium`}
        >
          {live ? "Live" : dayjs(startTime).format("HH:mm")}
        </p>
      </div>
      <div className="flex rounded-md bg-light-400 dark:bg-dark-400">
        <img
          src={avatar}
          alt={memberInfo.jpName}
          className="ml-1 w-[80px] self-center rounded-full p-1"
          loading="lazy"
        />
        <div className="flex h-[110px] w-full flex-auto flex-col justify-center overflow-hidden text-ellipsis px-3">
          <h3 className="my-1 text-base line-clamp-2">{title}</h3>
          <p className="mb-1 text-sm line-clamp-1">{channelTitle}</p>
        </div>
        <div className="w-[280px] rounded-r-md bg-light-400 dark:bg-dark-400">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="h-full rounded-r-md object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default LiveList;

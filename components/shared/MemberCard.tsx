/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { memo } from "react";
import { IMember } from "@/query/memberQuery";
import { IFavorite } from "@/query/favoriteQuery";
import FavoriteButton from "./FavoriteButton";

interface IBaseProps extends IMember {
  isFavorite: boolean;
  userId: string | null;
  favoriteData?: IFavorite;
}

const MemberCard: React.FC<IBaseProps> = ({
  id,
  jpName,
  enName,
  avatarName,
  agency,
  isFavorite,
  userId,
  favoriteData,
}) => {
  return (
    <div className="relative">
      <div className="relative h-0 pb-[100%]">
        <span className="absolute inset-0 overflow-hidden rounded-full bg-light-100 dark:bg-dark-100">
          <Link
            href={`/channel/${id}`}
            className="absolute inset-0 [&>img]:hover:scale-110"
          >
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${agency}/${avatarName}.jpg`}
                alt={"jp"}
                className="h-full w-full select-none object-cover transition-all duration-200 ease-in-out"
                loading="lazy"
              />
            </div>
          </Link>
        </span>
      </div>
      <div className="absolute top-0 ">
        <FavoriteButton
          userId={userId}
          isFavorite={isFavorite}
          favoriteData={favoriteData}
          memberId={id}
        />
      </div>
      <Link
        href={`/channel/${id}`}
        className="block select-none pt-3 text-center text-xl font-bold"
      >
        <p className="line-clamp-1">{jpName}</p>
        <p className="text-gray-400 line-clamp-1">{enName}</p>
      </Link>
    </div>
  );
};

export default memo(MemberCard);

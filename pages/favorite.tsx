/* eslint-disable @next/next/no-img-element */
import Skeleton from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsGridFill } from "react-icons/bs";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { LayoutGroup } from "framer-motion";
import { LiveCard, LiveList } from "../components";
import { getFavorite, IFavorite, useGetFavoriteQuery } from "@/query/favoriteQuery";
import { useGetLiveVideoByFavroiteQuery } from "@/query/vidoeQuery";
import {
  afterDateUtc,
  prevDateUtc,
  timeGenerate,
  timeSection,
  today,
} from "@/utils/liveTime";
import useStore from "@/store/useStore";
import "react-loading-skeleton/dist/skeleton.css";

interface IBaseProps {
  userId: string;
  favorite: IFavorite;
}

const Favotrite: React.FC<IBaseProps> = ({ userId, favorite }) => {
  const listStore = useStore((state) => state.list);
  const setList = useStore((state) => state.toggleList);
  const [isListStyle, setIsListStyle] = useState<boolean>(listStore);
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: favoriteData, isLoading: favoriteIsLoading } = useGetFavoriteQuery(
    userId,
    favorite
  );
  const { data: liveData, isLoading: liveDataIsLoading } = useGetLiveVideoByFavroiteQuery(
    favoriteData!.favorite,
    prevDateUtc,
    afterDateUtc
  );

  useEffect((): any => {
    setIsHydrated(true);
  }, []);

  const listStyleClick = (e: React.MouseEvent<SVGElement>) => {
    e.preventDefault();

    setList(!isListStyle);
    setIsListStyle((prev) => !prev);
  };

  const LoadingElement = () => (
    <div className="grid grid-cols-[repeat(auto-fill,1fr)] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} duration={1} count={1} height={100} baseColor="#68686B" />
      ))}
    </div>
  );

  const timeObj = liveData?.length ? timeGenerate(liveData) : undefined;

  const LiveScheduleElement = (date: string) => {
    const noLive = (
      <h2 className="flex h-full items-center justify-center text-3xl text-gray-400">
        No Live Streaming
      </h2>
    );

    if (!timeObj) return noLive;

    const timeSectionObj = timeObj.find((live) => live.date === date);
    if (!timeSectionObj?.live || Object.keys(timeSectionObj?.live).length === 0)
      return noLive;

    return Object.entries(timeSectionObj.live).map(([key, value]) => (
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
                <LiveList key={data.id} {...data} />
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
    ));
  };

  return (
    <div className="h-full overflow-y-scroll bg-light-100 dark:bg-dark-100">
      <section className="container m-auto flex items-center justify-end gap-2 py-3 pr-2">
        <GiHamburgerMenu
          className={`${
            !isListStyle && "hidden"
          } cursor-pointer text-3xl text-primary transition-[color] duration-150 ease-in-out`}
          onClick={listStyleClick}
        />
        <BsGridFill
          className={`${
            isListStyle && "hidden"
          } cursor-pointer text-3xl text-primary transition-[color] duration-150 ease-in-out`}
          onClick={listStyleClick}
        />
      </section>
      <section className="container relative m-auto h-[calc(100%-54px)]">
        <div className="absolute inset-0 bg-light-100 dark:bg-dark-100 ">
          {liveDataIsLoading ? LoadingElement() : LiveScheduleElement(today)}
        </div>
      </section>
    </div>
  );
};

export default Favotrite;

export const getServerSideProps = async (context: any) => {
  const supabase = createServerSupabaseClient(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userId = session?.user.id;

  if (!userId) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const favorite = await getFavorite(userId);

  return {
    props: { userId, favorite },
  };
};

/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsGridFill } from "react-icons/bs";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getFavorite, IFavorite, useGetFavoriteQuery } from "@/query/favoriteQuery";
import { useGetLiveVideoByFavroiteQuery } from "@/query/vidoeQuery";
import { afterDateUtc, prevDateUtc } from "@/utils/liveTime";
import useStore from "@/store/useStore";
import Loading from "@/components/specific/favorite/Loading";
import LiveSchedule from "@/components/specific/favorite/LiveSchedule";

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
    favoriteData?.favorite || [],
    prevDateUtc,
    afterDateUtc
  );

  useEffect((): any => {
    setIsHydrated(true);
  }, []);

  const listStyleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setList(!isListStyle);
    setIsListStyle((prev) => !prev);
  };

  return (
    <>
      <Head>
        <title>VTJoho - favorite</title>
      </Head>
      <div className="h-full overflow-y-scroll bg-light-100 dark:bg-dark-100">
        <div className="container m-auto flex items-center justify-end gap-2 py-3 pr-2">
          <button onClick={listStyleClick}>
            <GiHamburgerMenu
              className={`${
                !isListStyle && "hidden"
              } cursor-pointer text-3xl text-primary transition-[color] duration-150 ease-in-out hover:scale-110`}
            />
          </button>
          <button onClick={listStyleClick}>
            <BsGridFill
              className={`${
                isListStyle && "hidden"
              } cursor-pointer text-3xl text-primary transition-[color] duration-150 ease-in-out hover:scale-110`}
            />
          </button>
        </div>
        <div className="container relative m-auto h-[calc(100%-54px)]">
          <div className="absolute inset-0 bg-light-100 dark:bg-dark-100 ">
            {liveDataIsLoading ? (
              <Loading />
            ) : (
              <LiveSchedule liveData={liveData} isListStyle={isListStyle} />
            )}
          </div>
        </div>
      </div>
    </>
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

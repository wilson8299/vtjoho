/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import useStore from "@/store/useStore";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsGridFill } from "react-icons/bs";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { AgencyBar } from "@/components/shared";
import { getAgency, IAgency, useAgencyQuery } from "@/query/agencyQuery";
import { useGetLiveVideoByFavroiteQuery, useGetLiveVideoQuery } from "@/query/vidoeQuery";
import { getFavorite, IFavorite } from "@/query/favoriteQuery";
import { prevDateUtc, afterDateUtc, dateRangeArray, today } from "@/utils/liveTime";
import Loading from "@/components/specific/index/Loading";
import FavoriteLive from "@/components/specific/index/FavoriteLive";
import LiveSchedule from "@/components/specific/index/LiveSchedule";
import "swiper/css";
import "swiper/css/free-mode";

interface IBaseProps {
  agency: IAgency[];
  selectedAgencyName: string;
  userId: string | null;
  favorite: IFavorite;
}

const Home: React.FC<IBaseProps> = ({ agency, selectedAgencyName, userId, favorite }) => {
  const router = useRouter();
  const swiperRef = useRef<any>();
  const listStore = useStore((state) => state.list);
  const setList = useStore((state) => state.toggleList);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [radioChecked] = useState<string>(selectedAgencyName);
  const [isListStyle, setIsListStyle] = useState<boolean>(listStore);
  const { data: agencyData, isLoading: agencyIsLoading } = useAgencyQuery(agency);
  const { data: liveData, isLoading: liveDataIsLoading } = useGetLiveVideoQuery(
    radioChecked,
    prevDateUtc,
    afterDateUtc
  );
  const { data: favoriteLiveData, isLoading: favoriteLiveDataIsLoading } =
    useGetLiveVideoByFavroiteQuery(favorite.favorite, prevDateUtc, afterDateUtc);

  useEffect((): any => {
    setIsHydrated(true);
  }, []);

  const handleAgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`/${e.target.value}`);
  };

  const listStyleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setList(!isListStyle);
    setIsListStyle((prev) => !prev);
  };

  return (
    <>
      <Head>
        <title>{`VTJoho - ${selectedAgencyName}`}</title>
      </Head>
      <div className="flex h-full bg-light-400 dark:bg-dark-400">
        <div className="hidden h-full w-[56px] overflow-y-scroll bg-light-400 px-0.5 dark:bg-dark-400 sm:block [&::-webkit-scrollbar]:w-0">
          <FavoriteLive
            favoriteLiveData={favoriteLiveData}
            favoriteLiveDataIsLoading={favoriteLiveDataIsLoading}
          />
        </div>
        <div className="flex w-full flex-col">
          <nav className="bg-light-200 dark:bg-dark-200">
            {!agencyIsLoading && (
              <AgencyBar
                agencyData={agencyData!}
                radioChecked={radioChecked}
                handleAgencyChange={handleAgencyChange}
              />
            )}
          </nav>
          <div className="relative z-10 bg-light-300 pt-3 dark:bg-dark-300">
            <h2 className="dark:white text-center text-xl md:text-3xl">Live Streaming</h2>
            <button
              onClick={() => swiperRef.current.swiper.slidePrev()}
              disabled={slideProgress === 0}
              className="absolute top-7 left-[2%] rounded-full bg-slate-400 p-2 text-xl text-white disabled:hidden dark:bg-slate-600 lg:left-[8%]"
            >
              <MdOutlineArrowBackIos />
            </button>
            <button onClick={listStyleClick}>
              <GiHamburgerMenu
                className={`${
                  !isListStyle && "hidden"
                } absolute right-[12%] top-[30px] cursor-pointer text-3xl text-primary transition-all duration-150 ease-in-out hover:scale-110`}
              />
            </button>
            <button onClick={listStyleClick}>
              <BsGridFill
                className={`${
                  isListStyle && "hidden"
                } absolute top-[34px] right-[12%] cursor-pointer text-2xl text-primary transition-all duration-150 ease-in-out hover:scale-110`}
              />
            </button>
            <button
              onClick={() => swiperRef.current.swiper.slideNext()}
              disabled={slideProgress === 1}
              className="absolute top-7 right-[2%] rounded-full bg-slate-400 p-2 text-xl text-white disabled:hidden dark:bg-slate-600 lg:right-[8%]"
            >
              <MdOutlineArrowForwardIos />
            </button>
          </div>
          <div className="flex flex-auto bg-light-300 dark:bg-dark-300 ">
            <Swiper
              slidesPerView={"auto"}
              centeredSlides={true}
              spaceBetween={30}
              initialSlide={1}
              ref={swiperRef}
              onSlideChange={(swiper) => setSlideProgress(swiper.progress)}
              className="flex flex-auto cursor-default"
            >
              {dateRangeArray.map((data) => (
                <SwiperSlide
                  key={data.date}
                  className="container relative p-0 text-xl dark:text-white"
                >
                  <div
                    className={`${
                      today === data.date && "font-extrabold text-primary"
                    } flex max-h-[52px] justify-center gap-3 py-3 text-xl font-medium`}
                  >
                    <p>{data.date}</p>
                    <p>{data.day}</p>
                  </div>
                  <div className="relative h-[calc(100%-52px)]">
                    <div className="absolute inset-0 overflow-y-scroll bg-light-100 px-2 py-2 dark:bg-dark-100">
                      {isHydrated && liveDataIsLoading ? (
                        <Loading />
                      ) : (
                        <LiveSchedule
                          liveData={liveData}
                          isListStyle={isListStyle}
                          date={data.date}
                        />
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = async (context: any) => {
  const agency: IAgency[] = await getAgency();
  const agencyQuery = context.query.index;
  let agencyName = agencyQuery?.[0];
  if (agencyName === "index") agencyName = undefined;

  if (!agency || agencyQuery?.length > 1) {
    return {
      notFound: true,
    };
  }

  let selectedAgencyName = undefined;
  selectedAgencyName = agencyName ? undefined : agency[0].name;
  selectedAgencyName ||= agency.find((a) => a.name === agencyName)?.name;

  if (!selectedAgencyName) {
    return {
      notFound: true,
    };
  }

  const supabase = createServerSupabaseClient(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userId = session?.user.id || null;

  const favorite = await getFavorite(userId || null);

  return {
    props: { key: selectedAgencyName, agency, selectedAgencyName, userId, favorite },
  };
};

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Head from "next/head";
import Skeleton from "react-loading-skeleton";
import useStore from "@/store/useStore";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { LayoutGroup } from "framer-motion";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsGridFill } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { AgencyBar, LiveCard, LiveList } from "@/components";
import { getAgency, IAgency, useAgencyQuery } from "@/query/agencyQuery";
import { useGetLiveVideoByFavroiteQuery, useGetLiveVideoQuery } from "@/query/vidoeQuery";
import { getFavorite, IFavorite, useGetFavoriteQuery } from "@/query/favoriteQuery";
import {
  prevDateUtc,
  afterDateUtc,
  dateRangeArray,
  timeGenerate,
  timeSection,
  today,
} from "@/utils/liveTime";
import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";
import "swiper/css/free-mode";
import "react-tooltip/dist/react-tooltip.css";

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

  const FavoriteLiveElement = () => {
    return favoriteLiveDataIsLoading || !favoriteLiveData?.length ? (
      <p className="flex h-full w-full items-center justify-center overflow-hidden text-xl text-gray-500 [writing-mode:vertical-lr] [word-spacing:6px]">
        Your fave VTuber isn&apos;t live now
      </p>
    ) : (
      <div className="pt-4">
        {favoriteLiveData
          .sort((a, b) => ((a.startTime || 0) < (b.startTime || 0) ? 1 : -1))
          .sort((a, b) => (a.liveBroadcastContent > b.liveBroadcastContent ? 1 : -1))
          .map((data) => (
            <Fragment key={data.id}>
              <Link key={data.id} href={`/watch/${data.id}`} id={`f${data.id}`}>
                <div
                  className={`${
                    data.liveBroadcastContent === "live" &&
                    "rounded-full border-2 border-red-500"
                  } mb-1 cursor-pointer p-1`}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_CDN_URL}/${data.agencyName}/${data.memberInfo.avatarName}.jpg`}
                    alt={data.id}
                    className="rounded-full"
                  />
                </div>
              </Link>
              <Tooltip
                anchorSelect={`#f${data.id}`}
                place="right"
                className="z-50 max-w-[80%] !bg-light-400 !opacity-100 shadow-[4px_4px_8px_2px_rgba(0,0,0,0.3)] dark:!bg-dark-400 dark:shadow-[4px_4px_8px_2px_rgba(0,0,0,0.6)]"
              >
                <p className="text-black dark:text-white">{data.title}</p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {data.channelTitle}
                </p>
              </Tooltip>
            </Fragment>
          ))}
      </div>
    );
  };

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
      <div key={key} className="mt-6 first:mt-0">
        <div className="text-center">
          <p className="mt-2 mb-4 inline-block rounded-md bg-primary px-2 py-0.5 text-center text-xl font-medium text-white">
            {timeSection[key]}
          </p>
        </div>
        <LayoutGroup>
          {isListStyle ? (
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(450px,1fr))]">
              {value.map((data) => (
                <LiveList key={data.id} {...data} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
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
    <>
      <Head>
        <title>VTJoho - {selectedAgencyName}</title>
      </Head>
      <div className="flex h-full bg-light-400 dark:bg-dark-400">
        <div className="hidden h-full w-[56px] overflow-y-scroll bg-light-400 px-0.5 dark:bg-dark-400 sm:block [&::-webkit-scrollbar]:w-0">
          {FavoriteLiveElement()}
        </div>
        <div className="flex w-full flex-col">
          <section className="bg-light-200 dark:bg-dark-200">
            <AgencyBar
              agencyData={agencyData!}
              radioChecked={radioChecked}
              handleAgencyChange={handleAgencyChange}
            />
          </section>
          <section className="relative z-10 bg-light-300 pt-3 dark:bg-dark-300">
            <h2 className="dark:white text-center text-xl md:text-3xl">Live Streaming</h2>
            <button
              onClick={() => swiperRef.current.swiper.slidePrev()}
              disabled={slideProgress === 0}
              className="absolute top-7 left-[2%] rounded-full bg-slate-400 p-2 text-xl text-white disabled:hidden dark:bg-slate-600 lg:left-[8%]"
            >
              <MdOutlineArrowBackIos />
            </button>
            <GiHamburgerMenu
              className={`${
                !isListStyle && "hidden"
              } absolute right-[12%] top-[30px] cursor-pointer text-3xl text-primary transition-all duration-150 ease-in-out hover:scale-110`}
              onClick={listStyleClick}
            />
            <BsGridFill
              className={`${
                isListStyle && "hidden"
              } absolute top-[34px] right-[12%] cursor-pointer text-2xl text-primary transition-all duration-150 ease-in-out hover:scale-110`}
              onClick={listStyleClick}
            />
            <button
              onClick={() => swiperRef.current.swiper.slideNext()}
              disabled={slideProgress === 1}
              className="absolute top-7 right-[2%] rounded-full bg-slate-400 p-2 text-xl text-white disabled:hidden dark:bg-slate-600 lg:right-[8%]"
            >
              <MdOutlineArrowForwardIos />
            </button>
          </section>
          <section className="flex flex-auto bg-light-300 dark:bg-dark-300 ">
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
                      {isHydrated && liveDataIsLoading
                        ? LoadingElement()
                        : LiveScheduleElement(data.date)}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
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

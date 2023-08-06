/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GrYoutube, GrTwitter } from "react-icons/gr";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useGetFavoriteQuery } from "@/query/favoriteQuery";
import { IVideo, useGetVideoByMemberIdQuery } from "@/query/vidoeQuery";
import { getSingleMember, IMember, useGetSingleMemberQuery } from "@/query/memberQuery";
import {
  LiveCard,
  VideoCard,
  Pagination,
  FavoriteButton,
  LoadingSpinner,
} from "@/components/shared";
import { getPagination } from "@/utils/pagination";
import agencyNameMap from "@/utils/map";

interface IBaseProps {
  userId: string | null;
  member: IMember;
}

const perPageVideo = 16;

const Channel: React.FC<IBaseProps> = ({ userId, member }) => {
  const router = useRouter();
  const [live, setLive] = useState<IVideo[] | undefined>();
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { from, to } = getPagination(page, perPageVideo);
  const { data: memberData, isLoading: memberIsLoading } = useGetSingleMemberQuery(
    member.id,
    member
  );
  const { data: pageVideoData, isLoading: pageVideoIsLoading } =
    useGetVideoByMemberIdQuery(member.id, from, to);
  const { data: favoriteData, isLoading: favoriteIsLoading } =
    useGetFavoriteQuery(userId);

  useEffect(() => {
    if (!live) {
      setLive(
        pageVideoData?.data?.filter((video) => video.liveBroadcastContent !== "none")
      );
    }
  }, [pageVideoData]);

  let count = 0;
  if (!pageVideoIsLoading) {
    count = pageVideoData?.count || 0;
  }

  const handlePageChange = (selectedItem: { selected: number }) => {
    setLoading(true);
    const element = document.getElementById("video");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      handleEndScroll(selectedItem.selected);
    }
  };

  const handleEndScroll = useMemo(
    () =>
      debounce((selected: any) => {
        setPage(selected);
        setLoading(false);
      }, 500),
    []
  );

  return (
    <>
      <Head>
        <title>{`VTJoho - ${memberData?.jpName}`}</title>
      </Head>
      <div className="flex h-full flex-col overflow-y-auto bg-light-300 dark:bg-dark-300">
        {pageVideoData && loading && <LoadingSpinner />}
        <div
          style={{
            backgroundImage: `url(${memberData?.banner}=w2276-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj)`,
          }}
          className={`h-[15vw] shrink-0 bg-cover bg-center bg-no-repeat`}
        />
        <div className="container m-auto grow-0">
          <div className="flex flex-col justify-around py-6 sm:flex-row">
            <div className="flex flex-1 items-center">
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${memberData?.agency}/${memberData?.avatarName}.jpg`}
                alt={memberData?.jpName}
                className="mr-4 w-[80px] shrink-0 self-center rounded-full"
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">{memberData?.channelTitle}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {agencyNameMap[memberData?.agency!]}
                </p>
              </div>
            </div>
            <div className="mt-4 flex grow-0 items-center align-middle sm:mt-0">
              {favoriteData && memberData && (
                <FavoriteButton
                  userId={userId}
                  isFavorite={favoriteData.favorite.indexOf(member.id) > -1}
                  favoriteData={favoriteData}
                  memberId={memberData?.id}
                />
              )}
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://www.youtube.com/channel/${memberData?.id}` || undefined}
              >
                <GrYoutube className="ml-3 cursor-pointer text-3xl text-red-600" />
              </a>
              <a target="_blank" rel="noreferrer" href={memberData?.twitter || undefined}>
                <GrTwitter className="ml-3 cursor-pointer text-3xl text-primary" />
              </a>
            </div>
          </div>
        </div>
        <div className=" grow bg-light-200 py-6 dark:bg-dark-200">
          <div className="container mx-auto">
            <h3 className="pb-4 text-2xl">Live & Upcoming</h3>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {!favoriteIsLoading &&
                live?.map((live) => (
                  <LiveCard key={live.id} {...live} memberInfo={{ ...member }} />
                ))}
            </div>
            <h3 className="py-4 text-2xl" id="video">
              Video
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {!favoriteIsLoading &&
                pageVideoData?.data?.map((video) => (
                  <VideoCard key={video.id} {...video} memberInfo={{ ...member }} />
                ))}
            </div>
          </div>
          <div>
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(count / perPageVideo)}
              handlePageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Channel;

export const getServerSideProps = async (context: any) => {
  const id = context.query.index[0];

  const member = await getSingleMember(id);

  if (!member) {
    return {
      notFound: true,
    };
  }

  const supabase = createServerSupabaseClient(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userId = null;

  if (session) {
    userId = session.user.id;
  }

  return {
    props: { key: member.id, userId, member },
  };
};

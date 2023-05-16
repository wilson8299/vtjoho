/* eslint-disable react/display-name */
import debounce from "lodash/debounce";
import Skeleton from "react-loading-skeleton";
import { VirtuosoGrid, GridItemProps, GridListProps } from "react-virtuoso";
import { useCallback, useEffect, useRef, useState } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { getAgency, IAgency, useAgencyQuery } from "@/query/agencyQuery";
import { IMember, useMemberQuery } from "@/query/memberQuery";
import { useGetFavoriteQuery, useUpsertFavoriteMutation } from "@/query/favoriteQuery";
import { AgencyBar, MemberCard } from "@/components";
import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";
import "swiper/css/free-mode";
import React from "react";

interface IBaseProps {
  userId: string | null;
  agency: IAgency[];
  selectedAgencyName: string;
}

const Member: React.FC<IBaseProps> = ({ userId, agency, selectedAgencyName }) => {
  const router = useRouter();
  const customScrollParent = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [radioChecked, setRadioChecked] = useState<string>(selectedAgencyName);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { data: agencyData, isLoading: agencyIsLoading } = useAgencyQuery(agency);
  const { data: membersData, isLoading: memberIsLoading } = useMemberQuery(radioChecked);
  const { data: favoriteData, isLoading: favoriteIsLoading } =
    useGetFavoriteQuery(userId);
  const updateFavoriteMutation = useUpsertFavoriteMutation();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    searchBarRef.current!.value = "";
    setSearchQuery(null);
  }, [router]);

  const handleAgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`./${e.target.value}`);
  };

  const debounceFilter = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFilter(e.target.value.toLowerCase());
  };

  const filter = (members: IMember[] | undefined) => {
    if (!searchQuery) return members;

    return members?.filter((member) => {
      return (
        member.jpName.toLowerCase().includes(searchQuery) ||
        member.enName.toLowerCase().includes(searchQuery)
      );
    });
  };

  const LoadingElement = () =>
    [...Array(6)].map((_, i) => (
      <Skeleton
        key={i}
        circle={true}
        duration={1}
        count={1}
        className="h-0 pb-[100%]"
        baseColor="#68686B"
      />
    ));

  const MemberCardElement = () => {
    const ItemContainer = React.forwardRef<HTMLDivElement, GridItemProps>(
      (props, ref) => <div ref={ref} {...props} />
    );

    const ListContainer = React.forwardRef<HTMLDivElement, GridListProps>(
      (props, ref) => (
        <div
          ref={ref}
          {...props}
          style={{
            display: "grid",
            gap: "40px",
            ...props.style,
          }}
          className=" grid-cols-[repeat(auto-fill,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
        >
          {props.children}
        </div>
      )
    );

    return (
      <VirtuosoGrid
        customScrollParent={customScrollParent.current!}
        data={filter(membersData?.filter((member) => !member.official))}
        components={{
          List: ListContainer,
          Item: ItemContainer,
        }}
        itemContent={(index, member) => (
          <MemberCard
            key={member.id}
            {...member}
            userId={userId}
            favoriteData={favoriteData}
            isFavorite={favoriteData!.favorite.indexOf(member.id) > -1}
          />
        )}
        style={{ height: "100%", width: "100%" }}
      />
    );
  };

  return (
    <>
      <section className="bg-light-200 dark:bg-dark-200">
        <AgencyBar
          agencyData={agencyData!}
          radioChecked={radioChecked}
          handleAgencyChange={handleAgencyChange}
        />
      </section>
      <section
        ref={customScrollParent}
        className="h-[calc(100%-48px)] overflow-y-scroll bg-light-100 pt-5 dark:bg-dark-100"
      >
        <div className="container m-auto flex h-full flex-col">
          <div className="relative m-auto w-full lg:w-2/3 2xl:w-1/2">
            <input
              ref={searchBarRef}
              className="w-full rounded-md bg-transparent py-1 px-9 outline-none outline-2 outline-primary focus:outline-[3px] focus:outline-primary"
              placeholder="Searh By Name"
              type="text"
              onChange={handleSearchChange}
            />
            <FaSearch className="rotate-y-180 absolute left-3 top-2 font-bold" />
          </div>
          <div className="mt-10 h-full w-full">
            {memberIsLoading || favoriteIsLoading ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-10 pt-10 sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
                {LoadingElement()}
              </div>
            ) : (
              MemberCardElement()
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Member;

export const getServerSideProps = async (context: any) => {
  const agency: IAgency[] = await getAgency();
  const agencyQuery = context.query.index;
  const agencyName = agencyQuery?.[0];

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

  let userId = null;

  if (session) userId = session.user.id;

  return {
    props: { key: selectedAgencyName, userId, agency, selectedAgencyName },
  };
};

import debounce from "lodash/debounce";
import Head from "next/head";
import React, { useMemo } from "react";
import { useEffect, useRef, useState } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import { getAgency, IAgency, useAgencyQuery } from "@/query/agencyQuery";
import { IMember, useMemberQuery } from "@/query/memberQuery";
import { useGetFavoriteQuery } from "@/query/favoriteQuery";
import { AgencyBar, GotTopButton } from "@/components/shared";
import Loading from "@/components/specific/member/Loading";
import VirtualMemberCard from "@/components/specific/member/VirtualMemberCard";
import "swiper/css";
import "swiper/css/free-mode";

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
  const [showTopBtn, setShowTopBtn] = useState<boolean>(false);
  const [radioChecked, setRadioChecked] = useState<string>(selectedAgencyName);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { data: agencyData, isLoading: agencyIsLoading } = useAgencyQuery(agency);
  const { data: membersData, isLoading: memberIsLoading } = useMemberQuery(radioChecked);
  const { data: favoriteData, isLoading: favoriteIsLoading } =
    useGetFavoriteQuery(userId);

  const handleOnScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setShowTopBtn(e.currentTarget.scrollTop > 250);
  };

  const handleAgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`./${e.target.value}`);
  };

  const debounceFilter = useMemo(
    () =>
      debounce((query) => {
        setSearchQuery(query);
      }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFilter(e.target.value.toLowerCase());
  };

  const filterWithQuery = (members: IMember[] | undefined) => {
    if (!searchQuery || !members) return members;

    return members?.filter((member) => {
      return (
        member.jpName.toLowerCase().includes(searchQuery) ||
        member.enName.toLowerCase().includes(searchQuery)
      );
    });
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    searchBarRef.current!.value = "";
    setSearchQuery(null);
  }, [router]);

  return (
    <>
      <Head>
        <title>VTJoho - member</title>
        <meta httpEquiv="cache-control" content="no-cache"></meta>
      </Head>
      <nav className="bg-light-200 dark:bg-dark-200">
        {!agencyIsLoading && (
          <AgencyBar
            agencyData={agencyData!}
            radioChecked={radioChecked}
            handleAgencyChange={handleAgencyChange}
          />
        )}
      </nav>
      <div
        ref={customScrollParent}
        onScroll={handleOnScroll}
        className="h-[calc(100%-48px)] overflow-y-scroll bg-light-100 pt-5 dark:bg-dark-100"
      >
        <div className="container m-auto flex h-full flex-col">
          <div className="relative m-auto w-full lg:w-2/3 2xl:w-1/2">
            <input
              ref={searchBarRef}
              className="w-full rounded-md bg-transparent py-1 px-9 outline-none outline-2 outline-dark-100 focus:outline-[3px]
              focus:outline-dark-100 dark:outline-light-100 dark:focus:outline-light-100"
              placeholder="Searh by name"
              type="text"
              onChange={handleSearchChange}
            />
            <FaSearch className="rotate-y-180 absolute left-3 top-2 font-bold" />
          </div>
          <div className="mt-10 h-full w-full">
            {memberIsLoading || favoriteIsLoading ? (
              <Loading />
            ) : (
              <VirtualMemberCard
                userId={userId}
                favoriteData={favoriteData}
                filterWithQuery={filterWithQuery}
                membersData={membersData}
                customScrollParent={customScrollParent}
              />
            )}
          </div>
        </div>
        <div className="fixed bottom-4 right-6 z-50">
          <GotTopButton contentRef={customScrollParent} showTopBtn={showTopBtn} />
        </div>
      </div>
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

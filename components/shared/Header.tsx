/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { useUser } from "@supabase/auth-helpers-react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { useGetSimilarityMemberQuery } from "@/query/memberQuery";
import { spinAnimation } from "@/styles/animation";
import useStore from "@/store/useStore";

const Header: React.FC = () => {
  const user = useUser();
  const router = useRouter();
  const themeStore = useStore((state) => state.mode);
  const setThemeStore = useStore((state) => state.toggleTheme);
  const { theme, setTheme } = useTheme();
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [burgerIsOpen, setburgerIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(themeStore === "dark");
  const { data: searchData, isLoading: searchIsLoading } =
    useGetSimilarityMemberQuery(searchQuery);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const debounceFilter = useCallback(
    debounce((query) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFilter(e.target.value.toLowerCase());
  };

  const handleSearchFocus = (e: React.FormEvent<HTMLInputElement>) => {
    setburgerIsOpen(false);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(darkMode ? "light" : "dark");
    setDarkMode((prev) => !prev);
    setThemeStore();
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setburgerIsOpen((prev) => prev && false);
  };

  const handleBurgerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setburgerIsOpen((prev) => !prev);
    clearSearchQuery();
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    clearSearchQuery();
    router.push(`/channel/${id}`);
  };

  const handleClearSearch = (e: React.MouseEvent<SVGElement>) => {
    clearSearchQuery();
  };

  const clearSearchQuery = () => {
    setSearchQuery(null);
    searchBarRef.current!.value = "";
  };

  return (
    <div className="relative flex h-[42px] items-center bg-light-400 dark:bg-dark-400 sm:px-6">
      <Link href="/" className="mr-2 flex shrink-0 items-baseline">
        <img src={"/vtjoho-logo-img.png"} alt="vtjoho" className="ml-2 h-[28px]" />
        <img
          src={"/vtjoho-logo-text.png"}
          alt="vtjoho"
          className="ml-1 hidden h-[28px] xl:block"
        />
        <span className="ml-1 flex items-baseline text-sm text-primary">Beta</span>
      </Link>

      <div className="relative mx-4 flex w-full items-center lg:mx-24">
        <FaSearch
          className="rotate-y-180 absolute left-0 top-0 text-xl font-bold"
          onClick={() => searchBarRef.current?.focus()}
        />
        <input
          ref={searchBarRef}
          className="h-full w-full bg-transparent px-7 text-lg outline-none "
          placeholder="Searh by name"
          type="text"
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
        />
        {searchQuery && (
          <MdOutlineClose
            className="absolute right-0 -top-0.5 text-2xl font-bold"
            onClick={handleClearSearch}
          />
        )}
        <div className="absolute top-[30px] left-0  max-h-[300px] w-full overflow-y-auto bg-light-400 dark:bg-dark-400">
          {searchQuery && searchIsLoading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={spinAnimation}
              className="mx-auto my-6 block h-8 w-8 rounded-full border-[6px] border-t-[6px] border-transparent border-t-primary"
            />
          ) : (
            searchData?.map((data) => (
              <div
                key={data.id}
                className="flex items-center overflow-hidden px-4 py-2 hover:bg-light-200 hover:dark:bg-dark-200"
                onClick={(e) => handleSearchClick(e, data.id)}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/${data.agency}/${data.avatarName}.jpg`}
                  alt={data.enName}
                  className="w-[40px] shrink-0 rounded-full"
                />
                <p className="shrink-0 pl-2">{data.jpName}</p>
                <p className="shrink pl-2 text-gray-500 line-clamp-1">{data.enName}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mr-2 flex shrink-0 items-center">
        <button className="md:hidden" onClick={handleBurgerClick}>
          <span className="mt-0.5 block h-1 w-6 bg-primary" />
          <span className="mt-0.5 block h-1 w-6 bg-primary" />
          <span className="mt-0.5 block h-1 w-6 bg-primary" />
        </button>
        <div
          className={`${
            burgerIsOpen ? "max-h-[300px]" : "max-h-0"
          } absolute left-0 top-[42px] mt-0 flex w-full flex-col items-center overflow-hidden bg-light-400 transition-[max-height] duration-150 ease-in-out dark:bg-dark-400 md:static md:mt-0 md:h-full md:max-h-[42px] md:flex-row md:items-center md:px-0`}
        >
          <Link
            href="/"
            className="text-md mb-2 mr-2 font-medium sm:mb-0"
            onClick={handleLinkClick}
          >
            LIVE
          </Link>
          <Link
            href="/multi"
            className="text-md mb-2 mr-2 font-medium sm:mb-0"
            onClick={handleLinkClick}
          >
            MULTI
          </Link>
          <Link
            href="/member"
            className="text-md mr-2 mb-2 font-medium sm:mb-0"
            onClick={handleLinkClick}
          >
            MEMBER
          </Link>
          <Link
            href="/favorite"
            className="text-md mr-2 mb-2 font-medium sm:mb-0"
            onClick={handleLinkClick}
          >
            FAVORITE
          </Link>
          {isHydrated &&
            (!user ? (
              <Link
                href="/signin"
                className="text-md mr-2 mb-2 font-bold sm:mb-0 sm:mr-4"
                onClick={handleLinkClick}
              >
                SIGN IN
              </Link>
            ) : (
              <Link
                href="/signin"
                className="mr-2 mb-2 h-[32px] w-[32px] rounded-full bg-primary text-center text-2xl font-bold text-white sm:mb-0 sm:mr-4"
                onClick={handleLinkClick}
              >
                {user.email?.substring(0, 1)}
              </Link>
            ))}
          {isHydrated && (
            <div className="flex items-center gap-x-1 pb-3 sm:pb-0">
              <input
                id="mode"
                type="checkbox"
                className="peer hidden"
                onChange={handleModeChange}
                checked={darkMode}
              />
              <BsFillSunFill className="text-lg text-orange-500" />
              <label
                htmlFor="mode"
                className="relative inline-block h-[26px] w-[50px] cursor-pointer rounded-[20px] bg-gray-900 transition-all duration-200 ease-in-out before:absolute before:top-[3px] before:left-[3px] before:h-[20px] before:w-[20px] before:rounded-[50%] before:bg-gray-100 before:transition-all before:duration-200 before:ease-in-out peer-checked:before:left-[27px] dark:bg-gray-100 dark:before:bg-gray-900"
              />
              <BsFillMoonFill className="text-lg text-indigo-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

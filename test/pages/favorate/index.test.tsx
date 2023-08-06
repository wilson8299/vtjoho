import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { enableFetchMocks } from "jest-fetch-mock";
import Favotrite from "@/pages/favorite/index";
import { useGetLiveVideoByFavroiteQuery } from "@/query/vidoeQuery";
import { useGetFavoriteQuery } from "@/query/favoriteQuery";

enableFetchMocks();

jest.mock("swiper/css", () => jest.fn());
jest.mock("react-loading-skeleton/dist/skeleton.css", () => jest.fn());
jest.mock("swiper/css/free-mode", () => jest.fn());
jest.mock("@/query/supabaseClient", () => jest.fn());

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-modal", () => ({
  setAppElement: jest.fn(),
}));

jest.mock("@/query/favoriteQuery", () => ({
  useGetFavoriteQuery: jest.fn().mockReturnValue({ data: undefined, isLoading: false }),
}));

jest.mock("@/query/vidoeQuery", () => ({
  useGetLiveVideoByFavroiteQuery: jest.fn(),
}));

jest.mock("@/components/specific/favorite/Loading", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div>MockedLoading</div>),
}));

describe("Favotrite component", () => {
  test("render loading component while fetching data", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: true,
    }));

    render(<Favotrite userId="test_userId" favorite={{ id: "testId", favorite: [] }} />);
    expect(screen.getByText("MockedLoading")).toBeInTheDocument();
  });

  test("render favorite component after data is fetched", async () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));
    render(<Favotrite userId="test_userId" favorite={{ id: "testId", favorite: [] }} />);
    expect(await screen.findByText("No Live Streaming")).toBeInTheDocument();
  });
});

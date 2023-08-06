import "@testing-library/jest-dom";
import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { IVideoDetail, useGetVideoDetailByVideoIdQuery } from "@/query/vidoeQuery";
import Watch from "@/pages/watch/[id]";

enableFetchMocks();

jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/free-mode", () => jest.fn());
jest.mock("@/query/supabaseClient", () => jest.fn());
jest.mock("react-modal", () => ({
  setAppElement: jest.fn(),
}));

jest.mock("@/components/specific/watch/Title", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div>MockedTitle</div>),
}));

jest.mock("@/components/specific/watch/Desc", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div>MockedDesc</div>),
}));

jest.mock("@/components/specific/watch/Loading", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div>MockedLoading</div>),
}));

jest.mock("@/components/specific/watch/Chat", () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(({ data }) => (
      <div data-testid="mock-chat">
        {data?.videoInfo.liveBroadcastContent === "none" ? "No Live Chat" : "Chat iframe"}
      </div>
    )),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/query/favoriteQuery", () => ({
  __esModule: true,
  useGetFavoriteQuery: jest.fn().mockReturnValue({
    data: { id: "0", favorite: [] },
    isLoading: false,
    error: {},
  }),
}));

jest.mock("@/query/vidoeQuery", () => ({
  __esModule: true,
  getVideoDetailByVideoId: jest.fn(),
  useGetVideoDetailByVideoIdQuery: jest.fn(),
}));

jest.mock("@/pages/watch/[id]", () => {
  const originalModule = jest.requireActual("@/pages/watch/[id]");
  return {
    __esModule: true,
    ...originalModule,
    getServerSideProps: jest.fn().mockReturnValue(0),
  };
});

const videoDetail: IVideoDetail = {
  id: "test_id",
  description: "test_description",
  videoInfo: {
    id: "test_id",
    channelTitle: "test_channelTitle",
    title: "test_title",
    liveBroadcastContent: "none",
    startTime: null,
    publishedAt: "test_publishedAt",
    agencyName: "test_agencyName",
    memberId: "test_memberId",
    memberInfo: { avatarName: "test_avatarName", twitter: "test_twitter" },
  },
};

describe("Watch page testing", () => {
  it("render Loading when isLoading is true", () => {
    // require("@/query/vidoeQuery").useGetVideoDetailByVideoIdQuery.mockReturnValue({
    //   data: {},
    //   isLoading: true,
    //   error: {},
    // });
    (useGetVideoDetailByVideoIdQuery as jest.Mock).mockReturnValue({
      data: {},
      isLoading: true,
      error: {},
    });

    render(
      <Watch
        videoId="test_video_id"
        userId="test_user_id"
        videoData={{ ...videoDetail }}
      />
    );

    expect(screen.getByText(/MockedLoading/i)).toBeInTheDocument();
  });

  it("scroll Y <= 250, arrow up icon hidden", () => {
    (useGetVideoDetailByVideoIdQuery as jest.Mock).mockReturnValue({
      data: {
        videoInfo: { liveBroadcastContent: "none" },
        description: [...Array(100)].map(() => "live").join("\n"),
      },
      isLoading: false,
      error: {},
    });

    render(
      <Watch
        videoId="test_video_id"
        userId="test_user_id"
        videoData={{ ...videoDetail }}
      />
    );

    fireEvent.scroll(screen.getByTestId("video-content"), { target: { scrollTop: 250 } });
    const element = screen.getByTestId("goTopButton");
    expect(element).toHaveClass("hidden");
  });

  it("scroll Y > 250, arrow up icon show", async () => {
    require("@/query/vidoeQuery").useGetVideoDetailByVideoIdQuery.mockReturnValue({
      data: {
        videoInfo: { liveBroadcastContent: "none" },
        description: [...Array(100)].map(() => "live").join("\n"),
      },
      isLoading: false,
      error: {},
    });

    render(
      <Watch
        videoId="test_video_id"
        userId="test_user_id"
        videoData={{ ...videoDetail }}
      />
    );

    fireEvent.scroll(screen.getByTestId("video-content"), { target: { scrollTop: 251 } });
    const element = screen.getByTestId("goTopButton");
    expect(element).not.toHaveClass("hidden");
  });
});

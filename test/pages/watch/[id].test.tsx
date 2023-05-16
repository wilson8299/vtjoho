import "@testing-library/jest-dom";
import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
import { render, screen } from "@testing-library/react";
import Watch from "@/pages/watch/[id]";
import { IVideoDetail } from "@/query/vidoeQuery";

enableFetchMocks();

jest.mock("@/query/supabaseClient", () => jest.fn());

jest.mock("@/components", () => ({
  FavoriteButton: jest.fn().mockReturnValue("FackFavoriteButton"),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/query/favoriteQuery", () => ({
  useGetFavoriteQuery: jest.fn().mockReturnValue({
    data: { id: "0", favorite: [] },
    isLoading: false,
    error: {},
  }),
}));

jest.mock("@/query/vidoeQuery", () => ({
  __esModule: true,
  getVideoDetailByVideoId: jest.fn(),
  useGetVideoDetailByVideoIdQuery: jest.fn().mockReturnValue({
    data: {
      videoInfo: { liveBroadcastContent: "none" },
      description: [...Array(100)].map(() => "live").join("\n"),
    },
    isLoading: false,
    error: {},
  }),
}));

jest.mock("@/pages/watch/[id]", () => {
  const originalModule = jest.requireActual("@/pages/watch/[id]");
  return {
    __esModule: true,
    ...originalModule,
    getServerSideProps: jest.fn().mockReturnValue(0),
  };
});

// jest.mock("@/pages/watch/[id]", () => ({
//   __esModule: true,
//   default: () => (
//     <Watch videoId="test_video_id" userId="test_user_id" videoData={{ ...videoDetail }} />
//   ),
//   getServerSideProps: jest.fn().mockReturnValue(10),
//   // ...jest.requireActual("@/pages/watch/[id]"),
// }));

const videoDetail: IVideoDetail = {
  id: "test_id",
  description: "test_description",
  videoInfo: {
    id: "test_id",
    channelTitle: "test_channelTitle",
    title: "test_title",
    liveBroadcastContent: "test_liveBroadcastContent",
    startTime: null,
    publishedAt: "test_publishedAt",
    agencyName: "test_agencyName",
    memberId: "test_memberId",
    memberInfo: { avatarName: "test_avatarName", twitter: "test_twitter" },
  },
};

describe("Watch page testing", () => {
  it("if it is not live, display 'No Live Chat' element", () => {
    render(
      <Watch
        videoId="test_video_id"
        userId="test_user_id"
        videoData={{ ...videoDetail }}
      />
    );
    const element = screen.getByText(/No Live Chat/i);
    expect(element).toBeInTheDocument();
  });
  it("scroll Y < 250, arrow up icon hidden", () => {
    render(
      <Watch
        videoId="test_video_id"
        userId="test_user_id"
        videoData={{ ...videoDetail }}
      />
    );
    const element = screen.getByTestId("arrowup-icon");
    expect(element).toHaveClass("hidden");
  });
  // it("", () => {
  //   render(
  //     <Watch
  //       videoId="test_video_id"
  //       userId="test_user_id"
  //       videoData={{ ...videoDetail }}
  //     />
  //   );
  //   const videoContentEl = screen.getByTestId("video-content");
  //   fireEvent.scroll(videoContentEl, { target: { pageYOffset: 500 } });
  //   screen.debug();
  //   const arrowUpIcon = screen.getByTestId("arrowup-icon");
  //   expect(arrowUpIcon).not.toHaveClass("hidden");
  // });
});

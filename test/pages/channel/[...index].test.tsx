import "@testing-library/jest-dom";
import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
import { render, screen } from "@testing-library/react";
import Channel from "@/pages/channel/[...index]";
import { useGetVideoByMemberIdQuery } from "@/query/vidoeQuery";

enableFetchMocks();

jest.mock("@/query/supabaseClient", () => jest.fn());
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/free-mode", () => jest.fn());

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-modal", () => ({
  setAppElement: jest.fn(),
}));

jest.mock("@/query/memberQuery", () => ({
  useGetSingleMemberQuery: jest.fn().mockReturnValue({
    data: {
      id: "test_id",
      enName: "test_enName",
      jpName: "test_jpName",
      avatarName: "test_avatarName",
      banner: null,
      channelTitle: "test_channelTitle",
      agency: "test_agency",
    },
    isLoading: false,
  }),
}));

jest.mock("@/query/vidoeQuery", () => ({
  useGetVideoByMemberIdQuery: jest.fn(),
}));

jest.mock("@/query/favoriteQuery", () => ({
  useGetFavoriteQuery: jest.fn().mockReturnValue({
    data: {
      id: "test_user_id",
      favorite: [],
    },
    isLoading: false,
  }),
  useUpsertFavoriteMutation: jest.fn(),
}));

jest.mock("@/pages/channel/[...index]", () => {
  const originalModule = jest.requireActual("@/pages/channel/[...index]");
  return {
    __esModule: true,
    ...originalModule,
    getServerSideProps: jest.fn().mockReturnValue(0),
  };
});

const props = {
  userId: null,
  member: {
    id: "test_id",
    enName: "test_enName",
    jpName: "test_jpName",
    avatarName: "test_avatarName",
    banner: null,
    channelTitle: "test_channelTitle",
    agency: "test_agency",
  },
};

describe("Channel page testing", () => {
  it("render non-live video correctly", () => {
    (useGetVideoByMemberIdQuery as jest.Mock).mockImplementation(() => ({
      data: {
        data: [
          {
            id: "test_id",
            channelTitle: "test_channelTitle",
            title: "test_title",
            liveBroadcastContent: "none",
            startTime: "test_starTime",
            publishedAt: "test_publishedAt",
            agencyName: "test_agencyName",
            memberId: "test_memberId",
          },
        ],
        count: 1,
      },
      isLoading: false,
    }));

    render(<Channel {...props} />);

    const element = screen.getByText(/test_title/i);

    expect(element).toBeInTheDocument();
  });

  it("render live video correctly", () => {
    (useGetVideoByMemberIdQuery as jest.Mock).mockImplementation(() => ({
      data: {
        data: [
          {
            id: "test_id",
            channelTitle: "test_channelTitle",
            title: "test_title",
            liveBroadcastContent: "live",
            startTime: "test_starTime",
            publishedAt: "test_publishedAt",
            agencyName: "test_agencyName",
            memberId: "test_memberId",
          },
        ],
        count: 1,
      },
      isLoading: false,
    }));

    render(<Channel {...props} />);

    const elements = screen.getAllByText(/test_title/i);

    expect(elements.length).toBe(2);
  });

  it("render second page button when there are more than 16 videos", () => {
    (useGetVideoByMemberIdQuery as jest.Mock).mockImplementation(() => ({
      data: {
        data: [],
        count: 17,
      },
      isLoading: false,
    }));

    render(<Channel {...props} />);

    const element = screen.getByText(/2/i);

    expect(element).toBeInTheDocument();
  });
});

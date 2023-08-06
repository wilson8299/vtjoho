import "@testing-library/jest-dom";
import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
import { render, screen, within } from "@testing-library/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Home from "@/pages/[[...index]]";
import {
  IVideoWithMember,
  useGetLiveVideoByFavroiteQuery,
  useGetLiveVideoQuery,
} from "@/query/vidoeQuery";

dayjs.extend(utc);
dayjs.extend(timezone);

enableFetchMocks();

jest.mock("@/query/supabaseClient", () => jest.fn());
jest.mock("react-loading-skeleton/dist/skeleton.css", () => jest.fn());
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/free-mode", () => jest.fn());
jest.mock("react-tooltip/dist/react-tooltip.css", () => jest.fn());

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-modal", () => ({
  setAppElement: jest.fn(),
}));

jest.mock("framer-motion", () => {
  const actual = jest.requireActual("framer-motion");
  return {
    __esModule: true,
    ...actual,
    AnimatePresence: ({ children }: { children: any }) => (
      <div className="mocked-framer-motion-AnimatePresence">{children}</div>
    ),
    motion: {
      ...actual.motion,
      div: ({ children }: { children: any }) => (
        <div className="mocked-framer-motion-div">{children}</div>
      ),
    },
  };
});

jest.mock("@/query/agencyQuery", () => ({
  getAgency: jest.fn(),
  useAgencyQuery: jest.fn().mockReturnValue({
    data: [{ name: "test_agency" }],
    isLoading: false,
  }),
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
  useGetLiveVideoByFavroiteQuery: jest.fn(),
  useGetLiveVideoQuery: jest.fn(),
}));

jest.mock("@/pages/channel/[...index]", () => {
  const originalModule = jest.requireActual("@/pages/channel/[...index]");
  return {
    __esModule: true,
    ...originalModule,
    getServerSideProps: jest.fn().mockReturnValue(0),
  };
});

const generateLiveVideoData = ({
  id = "test_id",
  channelTitle = "test_channelTitle",
  title = "test_title",
  liveBroadcastContent = "none",
  startTime = null,
  publishedAt = "test_publishedAt",
  agencyName = "test_agencyName",
  memberId = "test_memberId",
  memberInfo = {
    enName: "test_enName",
    jpName: "test_jpName",
    avatarName: "test_avatarName",
  },
}: Partial<IVideoWithMember>) => {
  return {
    id,
    channelTitle,
    title,
    liveBroadcastContent,
    startTime,
    publishedAt,
    agencyName,
    memberId,
    memberInfo,
  };
};

const props = {
  agency: [{ name: "test_agency" }],
  selectedAgencyName: "test_selectedAgencyName",
  userId: null,
  favorite: { id: "test_favorite_id", favorite: ["test_favorite"] },
};

describe("Home page testing", () => {
  it("render 'No Live Streaming' if there is no live streaming", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    (useGetLiveVideoQuery as jest.Mock).mockImplementation(() => ({
      data: [generateLiveVideoData({ startTime: null })],
      isLoading: false,
    }));

    render(<Home {...props} />);

    const elements = screen.getAllByText(/No Live Streaming/i);

    expect(elements.length).toBe(3);
  });

  it("render non-live video correctly", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    (useGetLiveVideoQuery as jest.Mock).mockImplementation(() => ({
      data: [
        generateLiveVideoData({
          startTime: dayjs().utc().format("YYYY-MM-DD HH:ss:mmZ"),
        }),
      ],
      isLoading: false,
    }));

    render(<Home {...props} />);

    const element = screen.getByText(/test_title/i);
    const elements = screen.getAllByText(/No Live Streaming/i);

    expect(element).toBeInTheDocument();
    expect(elements.length).toBe(2);
  });

  it("render live time section correctly", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    (useGetLiveVideoQuery as jest.Mock).mockImplementation(() => ({
      data: [
        generateLiveVideoData({
          id: "test_id_1",
          startTime: dayjs()
            .utc()
            .subtract(1, "day")
            .hour(17)
            .format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
        generateLiveVideoData({
          id: "test_id_2",
          startTime: dayjs().utc().hour(1).format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
        generateLiveVideoData({
          id: "test_id_3",
          startTime: dayjs().utc().hour(7).format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
        generateLiveVideoData({
          id: "test_id_4",
          startTime: dayjs().utc().hour(15).format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
      ],
      isLoading: false,
    }));

    render(<Home {...props} />);

    const time0_6El = screen.getByText(/00:00 - 06:00/i);
    const time6_12El = screen.getByText(/06:00 - 12:00/i);
    const time12_18El = screen.getByText(/12:00 - 18:00/i);
    const time18_24El = screen.getByText(/18:00 - 24:00/i);

    expect(time0_6El).toBeInTheDocument();
    expect(time6_12El).toBeInTheDocument();
    expect(time12_18El).toBeInTheDocument();
    expect(time18_24El).toBeInTheDocument();
  });
  it("render today live time correctly", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    (useGetLiveVideoQuery as jest.Mock).mockImplementation(() => ({
      data: [
        generateLiveVideoData({
          id: "test_id",
          startTime: dayjs()
            .utc()
            .hour(1)
            .minute(30)
            .second(0)
            .millisecond(0)
            .format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
      ],
      isLoading: false,
    }));

    render(<Home {...props} />);

    const timeEl = screen.getByText(/06:00 - 12:00/i);
    const titleEl = screen.getByText(/test_title/i);
    const elements = screen.getAllByText(/No Live Streaming/i);

    expect(timeEl).toBeInTheDocument();
    expect(titleEl).toBeInTheDocument();
    expect(elements.length).toBe(2);
  });

  it("render yesterday live time correctly", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    (useGetLiveVideoQuery as jest.Mock).mockImplementation(() => ({
      data: [
        generateLiveVideoData({
          id: "test_id",
          startTime: dayjs()
            .utc()
            .subtract(1, "day")
            .hour(1)
            .minute(30)
            .second(0)
            .millisecond(0)
            .format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
      ],
      isLoading: false,
    }));

    render(<Home {...props} />);

    const timeEl = screen.getByText(/06:00 - 12:00/i);
    const titleEl = screen.getByText(/test_title/i);
    const elements = screen.getAllByText(/No Live Streaming/i);

    expect(timeEl).toBeInTheDocument();
    expect(titleEl).toBeInTheDocument();
    expect(elements.length).toBe(2);
  });

  it("render tomorrow live time correctly", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    (useGetLiveVideoQuery as jest.Mock).mockImplementation(() => ({
      data: [
        generateLiveVideoData({
          id: "test_id",
          startTime: dayjs()
            .utc()
            .add(1, "day")
            .hour(1)
            .minute(30)
            .second(0)
            .millisecond(0)
            .format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
      ],
      isLoading: false,
    }));

    render(<Home {...props} />);

    const timeEl = screen.getByText(/06:00 - 12:00/i);
    const titleEl = screen.getByText(/test_title/i);
    const elements = screen.getAllByText(/No Live Streaming/i);

    expect(timeEl).toBeInTheDocument();
    expect(titleEl).toBeInTheDocument();
    expect(elements.length).toBe(2);
  });
  it("render 'Your fave VTuber isn't live now' if there is no favorite data", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: undefined,
      isLoading: false,
    }));

    render(<Home {...props} />);

    const element = screen.getByText(/Your fave VTuber isn't live now/i);

    expect(element).toBeInTheDocument();
  });

  it("render favorite data correctly", () => {
    (useGetLiveVideoByFavroiteQuery as jest.Mock).mockImplementation(() => ({
      data: [
        generateLiveVideoData({
          id: "test_id",
          startTime: dayjs().add(1, "day").utc().hour(1).format("YYYY-MM-DD HH:ss:mmZ"),
          liveBroadcastContent: "live",
        }),
      ],
      isLoading: false,
    }));

    render(<Home {...props} />);

    const element = screen.queryByText("Your fave VTuber isn't live now");

    expect(element).not.toBeInTheDocument();
  });
});

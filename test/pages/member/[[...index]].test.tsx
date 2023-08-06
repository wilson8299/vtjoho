import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import React from "react";
import { enableFetchMocks } from "jest-fetch-mock";
import { render, screen } from "@testing-library/react";
import Member from "@/pages/member/[[...index]]";
import { IAgency, useAgencyQuery } from "@/query/agencyQuery";
import { useMemberQuery } from "@/query/memberQuery";
import { useGetFavoriteQuery } from "@/query/favoriteQuery";
import { VirtuosoGridMockContext } from "react-virtuoso";
import ResizeObserver from "resize-observer-polyfill";

global.ResizeObserver = ResizeObserver;
enableFetchMocks();

jest.mock("@/query/supabaseClient", () => jest.fn());
jest.mock("react-loading-skeleton/dist/skeleton.css", () => jest.fn());
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/free-mode", () => jest.fn());

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-modal", () => ({
  setAppElement: jest.fn(),
}));

jest.mock("@/components/specific/member/Loading", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div>MockedLoading</div>),
}));

jest.mock("@/query/agencyQuery", () => ({
  getAgency: jest.fn(),
  useAgencyQuery: jest.fn().mockReturnValue({
    data: [{ name: "test_agency" }],
    isLoading: false,
  }),
}));

jest.mock("@/query/memberQuery", () => ({
  useMemberQuery: jest.fn().mockReturnValue({
    data: [
      {
        id: "test_id",
        enName: "test_enName",
        jpName: "test_jpName",
        avatarName: "test_avatarName",
        banner: null,
        channelTitle: "test_channelTitle",
        agency: "test_agency",
      },
    ],
    isLoading: false,
  }),
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

jest.mock("@/pages/member/[[...index]]", () => {
  const originalModule = jest.requireActual("@/pages/member/[[...index]]");
  return {
    __esModule: true,
    ...originalModule,
    getServerSideProps: jest.fn().mockReturnValue(0),
  };
});

interface IBaseProps {
  userId: string | null;
  agency: IAgency[];
  selectedAgencyName: string;
}

const props: IBaseProps = {
  userId: null,
  agency: [],
  selectedAgencyName: "test_agency",
};

describe("Member page testing", () => {
  it("render Loading when memberIsLoading is true", () => {
    (useMemberQuery as jest.Mock).mockReturnValue({
      data: [
        {
          id: "test_user_id",
          favorite: [],
        },
      ],
      isLoading: true,
    });
    (useGetFavoriteQuery as jest.Mock).mockImplementation(() => ({
      data: {},
      isLoading: false,
    }));

    render(<Member {...props} />);
    expect(screen.getByText(/MockedLoading/i)).toBeInTheDocument();
  });

  it("render Loading when favoriteIsLoading is true", () => {
    (useMemberQuery as jest.Mock).mockImplementation(() => ({
      data: [
        {
          id: "test_user_id",
          favorite: [],
        },
      ],
      isLoading: false,
    }));
    (useGetFavoriteQuery as jest.Mock).mockImplementation(() => ({
      data: {},
      isLoading: true,
    }));

    render(<Member {...props} />);
    expect(screen.getByText(/MockedLoading/i)).toBeInTheDocument();
  });

  it("shows VirtualMemberCard when member and favorite data has been loaded", () => {
    (useMemberQuery as jest.Mock).mockImplementation(() => ({
      data: [
        {
          id: "test_id",
          enName: "test_enName",
          jpName: "test_jpName",
          avatarName: "test_avatarName",
          banner: null,
          channelTitle: "test_channelTitle",
          agency: "test_agency",
        },
      ],
      isLoading: false,
    }));
    (useGetFavoriteQuery as jest.Mock).mockImplementation(() => ({
      data: {},
      isLoading: false,
    }));

    render(<Member {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoGridMockContext.Provider
          value={{
            viewportHeight: 300,
            viewportWidth: 300,
            itemHeight: 100,
            itemWidth: 100,
          }}
        >
          {children}
        </VirtuosoGridMockContext.Provider>
      ),
    });

    expect(screen.getByText(/test_jpName/i)).toBeInTheDocument();
  });

  it("render multiple agency names correctly", () => {
    (useAgencyQuery as jest.Mock).mockImplementation(() => ({
      data: [{ name: "test_agency" }, { name: "test_agency2" }, { name: "test_agency3" }],
      isLoading: false,
    }));

    render(<Member {...props} />);

    const elements = screen.getAllByText(/test_agency/i);

    expect(elements).toHaveLength(3);
  });

  it("type in the input to filter the members by en name", () => {
    (useMemberQuery as jest.Mock).mockImplementation(() => ({
      data: [
        {
          id: "test_id",
          enName: "test_enName",
          jpName: "test_jpName",
          avatarName: "test_avatarName",
          banner: null,
          channelTitle: "test_channelTitle",
          agency: "test_agency",
        },
        {
          id: "test_id_2",
          enName: "test_enName_2",
          jpName: "test_jpName_2",
          avatarName: "test_avatarName",
          banner: null,
          channelTitle: "test_channelTitle",
          agency: "test_agency",
        },
      ],
      isLoading: false,
    }));

    render(<Member {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoGridMockContext.Provider
          value={{
            viewportHeight: 300,
            viewportWidth: 300,
            itemHeight: 100,
            itemWidth: 100,
          }}
        >
          {children}
        </VirtuosoGridMockContext.Provider>
      ),
    });

    const inputEl = screen.getByRole("textbox");
    userEvent.type(inputEl, "test_enName_2");

    const enEl = screen.getByText(/test_enName_2/i);

    expect(enEl).toBeInTheDocument();
  });

  it("type in the input to filter the members by jp name", () => {
    (useMemberQuery as jest.Mock).mockImplementation(() => ({
      data: [
        {
          id: "test_id",
          enName: "test_enName",
          jpName: "test_jpName",
          avatarName: "test_avatarName",
          banner: null,
          channelTitle: "test_channelTitle",
          agency: "test_agency",
        },
        {
          id: "test_id_2",
          enName: "test_enName_2",
          jpName: "test_jpName_2",
          avatarName: "test_avatarName",
          banner: null,
          channelTitle: "test_channelTitle",
          agency: "test_agency",
        },
      ],
      isLoading: false,
    }));
    render(<Member {...props} />, {
      wrapper: ({ children }) => (
        <VirtuosoGridMockContext.Provider
          value={{
            viewportHeight: 300,
            viewportWidth: 300,
            itemHeight: 100,
            itemWidth: 100,
          }}
        >
          {children}
        </VirtuosoGridMockContext.Provider>
      ),
    });

    const inputEl = screen.getByRole("textbox");
    userEvent.type(inputEl, "test_jpName_2");

    const jpEl = screen.getByText(/test_jpName_2/i);

    expect(jpEl).toBeInTheDocument();
  });
});

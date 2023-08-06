import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Title from "@/components/specific/watch/Title";
import { IVideoDetail } from "@/query/vidoeQuery";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/shared/FavoriteButton", () => ({
  __esModule: true,
  FavoriteButton: jest.fn().mockReturnValue("FackFavoriteButton"),
}));

const createVideoDetail = (
  agencyName: string = "test_agencyName",
  title: string = "test_title",
  channelTitle: string = "test_channelTitle"
): IVideoDetail => {
  return {
    id: "test_id",
    description: "test_description",
    videoInfo: {
      id: "test_id",
      channelTitle,
      title,
      liveBroadcastContent: "none",
      startTime: null,
      publishedAt: "test_publishedAt",
      agencyName,
      memberId: "test_memberId",
      memberInfo: { avatarName: "test_avatarName", twitter: "test_twitter" },
    },
  };
};

describe("Watch page Title component testing", () => {
  const mockRouterPush = jest.fn();
  beforeEach(() => {
    require("next/router").useRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("render the title、channelTitle and the agency name", () => {
    const mockData = createVideoDetail();

    render(<Title data={mockData} userId="test_user_id" favoriteData={undefined} />);

    expect(screen.getByText(mockData.videoInfo.title)).toBeInTheDocument();
    expect(screen.getByText(mockData.videoInfo.channelTitle)).toBeInTheDocument();
    expect(screen.getByText(mockData.videoInfo.agencyName)).toBeInTheDocument();
  });

  it("redirect to the channel page when the name is clicked", () => {
    const mockData = createVideoDetail();
    render(<Title data={mockData} userId="test_user_id" favoriteData={undefined} />);

    const nameElement = screen.getByText(mockData.videoInfo.channelTitle);
    fireEvent.click(nameElement);

    expect(mockRouterPush).toHaveBeenCalledWith(
      `/channel/${mockData.videoInfo.memberId}`
    );
  });

  it("render the correct YouTube link", () => {
    const mockData = createVideoDetail();
    render(<Title data={mockData} userId="test_user_id" favoriteData={undefined} />);

    const youtubeLink = document.querySelector(
      `a[href^="https://www.youtube.com/channel/${mockData.videoInfo.memberId}"]`
    );
    expect(youtubeLink).toBeInTheDocument();
  });

  it("render the correct Twitter link", () => {
    const mockData = createVideoDetail();
    render(<Title data={mockData} userId="test_user_id" favoriteData={undefined} />);

    const youtubeLink = document.querySelector(
      `a[href^="${mockData.videoInfo.memberInfo.twitter}"]`
    );
    expect(youtubeLink).toBeInTheDocument();
  });
});

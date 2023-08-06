import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Chat from "@/components/specific/watch/Chat";
import { IVideoDetail } from "@/query/vidoeQuery";

const createVideoDetail = (
  liveBroadcastContent: string = "test_liveBroadcastContent"
): IVideoDetail => {
  return {
    id: "test_id",
    description: "test_description",
    videoInfo: {
      id: "test_id",
      channelTitle: "test_channelTitle",
      title: "test_title",
      liveBroadcastContent,
      startTime: null,
      publishedAt: "test_publishedAt",
      agencyName: "test_agencyName",
      memberId: "test_memberId",
      memberInfo: { avatarName: "test_avatarName", twitter: "test_twitter" },
    },
  };
};

describe("Watch page Chat component testing", () => {
  it("display 'No Live Chat' when liveBroadcastContent is 'none'", () => {
    const mockData = createVideoDetail("none");

    render(<Chat data={mockData} chatId="test_video_id" />);

    expect(screen.getByText(/No Live Chat/i)).toBeInTheDocument();
  });

  it("display iframe when liveBroadcastContent is not 'none'", () => {
    const mockData = createVideoDetail("live");

    const { container } = render(<Chat data={mockData} chatId="test_video_id" />);

    const iframe = container.querySelector("iframe");

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("https://www.youtube.com/live_chat?v=test_video_id")
    );
  });
});

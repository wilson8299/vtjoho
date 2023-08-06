import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Desc from "@/components/specific/watch/Desc";
import { IVideoDetail } from "@/query/vidoeQuery";

const createVideoDetail = (description: string = "test_description"): IVideoDetail => {
  return {
    id: "test_id",
    description,
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
};

describe("Watch page Desc component testing", () => {
  it("render correctly with description containing a URL", () => {
    const mockData = createVideoDetail(
      "This is a description with a URL: http://example.com"
    );

    render(<Desc data={mockData} />);

    const linkElement = screen.getByRole("link");
    expect(linkElement).toHaveAttribute("href", "http://example.com");
    expect(screen.getByText("This is a description with a URL:")).toBeInTheDocument();
  });

  it("render correctly with description without a URL", () => {
    const mockData = createVideoDetail("This is a description without a URL.");

    render(<Desc data={mockData} />);

    expect(screen.getByText("This is a description without a URL.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("render nothing when data is null, content empty", () => {
    const { container } = render(<Desc data={null} />);

    const divElement = container.querySelector("div");
    expect(divElement).toBeEmptyDOMElement();
  });
});

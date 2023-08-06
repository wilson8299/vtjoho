import React from "react";
import { render, screen } from "@testing-library/react";
import { VirtuosoGridMockContext } from "react-virtuoso";
import { IMember } from "@/query/memberQuery";
import VirtualMemberCard from "@/components/specific/member/VirtualMemberCard";

jest.mock("@/components/shared", () => {
  return {
    __esModule: true,
    MemberCard: jest.fn().mockReturnValue("MockedMemberCard"),
  };
});

const createMember = (id: string, official: boolean): IMember => {
  return {
    id,
    enName: "test_enName_2",
    jpName: "test_jpName_2",
    avatarName: "test_avatarName",
    banner: null,
    channelTitle: "test_channelTitle",
    agency: "test_agency",
    official,
  };
};

describe("Member page VirtualMemberCard component testing", () => {
  it("render the member cards", () => {
    const membersData: IMember[] = [
      createMember("m1", false),
      createMember("m2", false),
      createMember("m3", true),
    ];

    render(
      <VirtualMemberCard
        userId="test_user_id"
        favoriteData={undefined}
        filterWithQuery={(members) => members}
        membersData={membersData}
        customScrollParent={React.createRef<HTMLDivElement>()}
      />,
      {
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
      }
    );

    const memberCards = screen.getAllByText("MockedMemberCard");
    expect(memberCards).toHaveLength(2);
  });
});

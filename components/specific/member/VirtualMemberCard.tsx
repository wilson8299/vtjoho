import React from "react";
import { VirtuosoGrid, GridItemProps, GridListProps } from "react-virtuoso";
import { MemberCard } from "@/components/shared";
import { IFavorite } from "@/query/favoriteQuery";
import { IMember } from "@/query/memberQuery";

interface IBaseProps {
  userId: string | null;
  favoriteData: IFavorite | undefined;
  filterWithQuery: (members: IMember[] | undefined) => IMember[] | undefined;
  membersData: IMember[] | undefined;
  customScrollParent: React.RefObject<HTMLDivElement>;
}

const VirtualMemberCard: React.FC<IBaseProps> = ({
  userId,
  favoriteData,
  filterWithQuery,
  membersData,
  customScrollParent,
}) => {
  const ItemContainer = React.forwardRef<HTMLDivElement, GridItemProps>((props, ref) => (
    <div ref={ref} {...props} />
  ));

  const ListContainer = React.forwardRef<HTMLDivElement, GridListProps>((props, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: "grid",
        gap: "40px",
        ...props.style,
      }}
      className=" grid-cols-[repeat(auto-fill,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
    >
      {props.children}
    </div>
  ));

  ItemContainer.displayName = "member-ItemContainer";
  ListContainer.displayName = "memner-ListContainer";

  return (
    <VirtuosoGrid
      customScrollParent={customScrollParent?.current || undefined}
      data={filterWithQuery(membersData?.filter((member) => !member.official))}
      components={{
        List: ListContainer,
        Item: ItemContainer,
      }}
      itemContent={(index, member) => (
        <MemberCard
          key={member.id}
          {...member}
          userId={userId}
          favoriteData={favoriteData}
          isFavorite={!!favoriteData && favoriteData.favorite?.indexOf(member.id) > -1}
        />
      )}
      style={{ height: "100%", width: "100%" }}
    />
  );
};

export default VirtualMemberCard;

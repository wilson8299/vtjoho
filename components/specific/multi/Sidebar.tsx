import React from "react";
import RGL from "react-grid-layout";
import { AiFillDelete, AiFillPlusSquare, AiOutlineRollback } from "react-icons/ai";
import { ButtonWithTooltip } from "@/components/shared";
import { ILiveInfo } from "@/pages/multi";
import findSuitablePosition from "@/utils/findSuitablePosition";

interface IBaseProps {
  viewsLayout: RGL.Layout[];
  setViewsLayout: React.Dispatch<React.SetStateAction<RGL.Layout[]>>;
  setViews: React.Dispatch<React.SetStateAction<ILiveInfo[]>>;
}

const Sidebar: React.FC<IBaseProps> = ({ viewsLayout, setViewsLayout, setViews }) => {
  const handleAddView = () => {
    const id = `id_${Date.now()}`;

    const pos = findSuitablePosition(
      viewsLayout,
      { i: id, x: 0, y: 0, w: 8, h: 8 },
      Infinity,
      16
    );

    const newViewLayout: RGL.Layout = {
      i: id,
      x: pos.x,
      y: pos.y,
      w: 8,
      h: 8,
      minW: 4,
      minH: 5,
    };

    setViewsLayout((prev: RGL.Layout[]) =>
      prev ? [...prev, newViewLayout] : [newViewLayout]
    );
  };

  const handleReselectAllView = () => {
    setViews([]);
  };

  const handleRemoveAllView = () => {
    setViewsLayout([]);
    setViews([]);
  };

  return (
    <>
      <aside className="flex flex-[0_0_50px] flex-col items-center bg-light-400 pt-4 dark:bg-dark-400">
        <ButtonWithTooltip
          id="add-view"
          onClick={handleAddView}
          icon={<AiFillPlusSquare className=" text-3xl text-teal-500 " />}
          tooltipText="Add View"
        />
        <ButtonWithTooltip
          id="reselect-all"
          onClick={handleReselectAllView}
          icon={<AiOutlineRollback className=" text-3xl text-lime-500" />}
          tooltipText="Reselect All"
        />
        <ButtonWithTooltip
          id="remove-all"
          onClick={handleRemoveAllView}
          icon={<AiFillDelete className=" text-3xl text-red-500" />}
          tooltipText="Remove All"
        />
      </aside>
    </>
  );
};

export default Sidebar;

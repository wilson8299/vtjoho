import React from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface IBaseProps {
  id: string;
  onClick: () => void;
  icon: JSX.Element;
  tooltipText: string;
}

const ButtonWithTooltip: React.FC<IBaseProps> = ({ id, onClick, icon, tooltipText }) => {
  return (
    <>
      <button
        id={id}
        data-testid={id}
        className="select-none py-2 outline-none"
        onClick={onClick}
      >
        {icon}
      </button>

      <Tooltip
        anchorSelect={`#${id}`}
        place="right"
        className="z-50 max-w-[80%] !bg-light-400 !opacity-100 shadow-[4px_4px_8px_2px_rgba(0,0,0,0.3)] dark:!bg-dark-400 dark:shadow-[4px_4px_8px_2px_rgba(0,0,0,0.6)]"
      >
        <p className="select-none text-black dark:text-white">{tooltipText}</p>
      </Tooltip>
    </>
  );
};

export default ButtonWithTooltip;

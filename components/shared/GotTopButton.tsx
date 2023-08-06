import React from "react";
import { AiOutlineArrowUp } from "react-icons/ai";

interface IBaseProps {
  contentRef: React.RefObject<HTMLDivElement>;
  showTopBtn: boolean;
}

const GotTopButton: React.FC<IBaseProps> = ({ contentRef, showTopBtn }) => {
  const handleGoToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    contentRef?.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={handleGoToTop}
      data-testid="goTopButton"
      className={`${
        showTopBtn ? "block" : "hidden"
      } cursor-pointer rounded-sm bg-primary p-0.5 duration-150 ease-in-out hover:scale-125`}
    >
      <AiOutlineArrowUp className="text-2xl" />
    </button>
  );
};

export default GotTopButton;

import { useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

interface IBaseProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
}

const Collapse: React.FC<IBaseProps> = ({ open, title, children }) => {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <>
      <>{isOpen && children}</>
      <div
        className="flex cursor-pointer items-center justify-center py-2"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h5 className="text-xl font-bold">{title}</h5>
        {isOpen ? (
          <AiOutlineArrowUp className="pl-3 text-3xl" />
        ) : (
          <AiOutlineArrowDown className="pl-3 text-3xl" />
        )}
      </div>
    </>
  );
};

export default Collapse;

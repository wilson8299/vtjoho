import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
import { ILiveInfo } from "@/pages/multi";

interface IBaseProps {
  views: ILiveInfo[];
  chatId: string;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
}

const Chat: React.FC<IBaseProps> = ({ views, chatId, setChatId }) => {
  const { theme } = useTheme();
  const [chatIsOpen, setChatIsOpen] = useState<boolean>(true);
  const [iframeLoading, setiframeLoading] = useState<boolean>(true);

  const handlePrevChat = () => {
    setiframeLoading(true);
    if (views.length <= 1 || views.every((v) => v.video === chatId)) {
      setiframeLoading(false);
      return;
    }

    let currentIndex = views?.findIndex((v) => v.video === chatId);
    let prevIndex = (currentIndex - 1 + views.length) % views.length;

    while (views[prevIndex].video === chatId) {
      prevIndex = (prevIndex - 1 + views.length) % views.length;
    }
    setChatId(views[prevIndex].video);
  };

  const handleNextChat = () => {
    setiframeLoading(true);
    if (views.length <= 1 || views.every((v) => v.video === chatId)) {
      setiframeLoading(false);
      return;
    }

    let currentIndex = views?.findIndex((v) => v.video === chatId);
    let nextIndex = (currentIndex + 1) % views.length;

    while (views[nextIndex].video === chatId) {
      nextIndex = (nextIndex + 1) % views.length;
    }

    setChatId(views[nextIndex].video);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);

    return () => clearTimeout(timer);
  }, [chatIsOpen]);

  return (
    <div className="flex">
      <button
        onClick={() => setChatIsOpen((prev) => !prev)}
        className="select-none bg-light-400 outline-none dark:bg-dark-400"
      >
        {chatIsOpen ? <MdOutlineArrowForwardIos /> : <MdOutlineArrowBackIos />}
      </button>
      <div
        className={`${
          chatIsOpen ? "w-[320px]" : "-z-50 w-0"
        } h-full shrink-0 bg-light-200 transition-[width] duration-150 ease-in-out dark:bg-dark-100`}
      >
        {chatId ? (
          <>
            <div className="flex justify-between px-1">
              <button onClick={handlePrevChat}>
                <MdOutlineArrowBackIos />
              </button>

              <p className="m-auto">
                {views?.find((v) => v.video === chatId)?.videoName}
              </p>

              <button onClick={handleNextChat}>
                <MdOutlineArrowForwardIos />
              </button>
            </div>
            <iframe
              key={`${chatId}-${theme}`}
              src={`https://www.youtube.com/live_chat?v=${chatId}&embed_domain=${
                process.env.NEXT_PUBLIC_VTJOHO_HOSTNAME
              }&dark_theme=${theme === "dark" ? "1" : "0"}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
              className={`${iframeLoading ? "w-0" : "w-full"} z-50 h-[calc(100%-24px)]`}
              onLoad={() => setiframeLoading(false)}
            />
          </>
        ) : (
          <p className="flex h-full items-center justify-center text-2xl text-gray-400">
            No Live Chat
          </p>
        )}
      </div>
    </div>
  );
};

export default Chat;

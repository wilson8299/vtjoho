import React from "react";
import { useTheme } from "next-themes";
import { IVideoDetail } from "@/query/vidoeQuery";

interface IBaseProps {
  data: IVideoDetail | null | undefined;
  chatId: string;
}

const Chat: React.FC<IBaseProps> = ({ data, chatId }) => {
  const { theme } = useTheme();

  return (
    <div className="z-50 h-[calc(100%-53.25vw)] w-full shrink-0 bg-light-200 dark:bg-dark-100 sm:static sm:h-full sm:w-[320px]">
      {data?.videoInfo.liveBroadcastContent === "none" ? (
        <p className="flex h-full items-center justify-center text-2xl text-gray-400">
          No Live Chat
        </p>
      ) : (
        <iframe
          key={`${chatId}-${theme}`}
          src={`https://www.youtube.com/live_chat?v=${chatId}&embed_domain=${
            process.env.NEXT_PUBLIC_VTJOHO_HOSTNAME
          }&dark_theme=${theme === "dark" ? "1" : "0"}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
          className="h-full w-full"
        />
      )}
    </div>
  );
};

export default Chat;

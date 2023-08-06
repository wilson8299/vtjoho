import Head from "next/head";
import ReactPlayer from "react-player/lazy";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGetThreeDayLiveVideoQuery } from "@/query/vidoeQuery";
import { useAgencyQuery } from "@/query/agencyQuery";
import { afterDateUtc, prevDateUtc } from "@/utils/liveTime";
import { LoadingSpinner } from "@/components/shared";
import useStore from "@/store/useStore";
import Sidebar from "@/components/specific/multi/Sidebar";
import Chat from "@/components/specific/multi/Chat";
import MultiModal from "@/components/specific/multi/MultiModal";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

export interface ILiveInfo {
  i: string;
  playing: boolean;
  video: string;
  videoName: string;
}

export interface IModalState {
  id?: string;
  isOpen: boolean;
}

const ReactGridLayout = WidthProvider(Responsive);
const COLS = 16;

const Multi: React.FC = () => {
  const lineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewsLayoutStore = useStore((state) => state.viewsLayout);
  const viewsStore = useStore((state) => state.views);
  const setViewsLayoutStore = useStore((state) => state.setViewsLayout);
  const setViewsStore = useStore((state) => state.setViews);
  const [dragging, setDragging] = useState<boolean>(false);
  const [viewsLayout, setViewsLayout] = useState<RGL.Layout[]>(viewsLayoutStore);
  const [views, setViews] = useState<ILiveInfo[]>(
    viewsStore.map((vs) => ({ ...vs, playing: false }))
  );
  const [chatId, setChatId] = useState<string>(
    viewsStore?.length === 0 ? "" : viewsStore[0].video
  );
  const [modalState, setModalState] = useState<IModalState>({ isOpen: false });
  const [selectedLive, setSelectedLive] = useState<string>();
  const { data: agencyData, isLoading: agencyIsLoading } = useAgencyQuery();
  const {
    data: liveData,
    isLoading: liveDataIsLoading,
    refetch: fetchLiveData,
    isRefetching: liveDataIsRefetching,
  } = useGetThreeDayLiveVideoQuery(prevDateUtc, afterDateUtc);

  const updateView = useCallback(
    (id: string, updateFn: (view?: ILiveInfo) => ILiveInfo) => {
      setViews((views) => {
        const currentViewIndex = views?.findIndex((view) => view.i === id);

        if (currentViewIndex !== -1) {
          const updatedView = updateFn(views[currentViewIndex]);
          return [
            ...views.slice(0, currentViewIndex),
            updatedView,
            ...views.slice(currentViewIndex + 1),
          ];
        } else {
          return [...views, updateFn()];
        }
      });
    },
    []
  );

  const handleYtPause = (id: string) => {
    updateView(id, (view) => ({ ...view!, playing: false }));
  };

  const handleYtPlay = (id: string) => {
    updateView(id, (view) => ({ ...view!, playing: true }));
  };

  const handleRemoveLive = (id: string) => {
    setViews(views?.filter((view) => view.i !== id));
    setViewsLayout(viewsLayout?.filter((viewLayout) => viewLayout.i !== id));
  };

  const handleReselectLive = (id: string) => {
    setViews(views?.filter((view) => view.i !== id));
  };

  const handleSelectView = (i: string, e: React.MouseEvent<HTMLButtonElement>) => {
    fetchLiveData();
    setModalState({ id: i, isOpen: true });
    setDragging(false);
  };

  const handleRemoveView = (i: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setViewsLayout(viewsLayout?.filter((view) => view.i !== i));
    setViews(views?.filter((view) => view.i !== i));
  };

  const handleLayoutChange = (layout: RGL.Layout[], layouts: RGL.Layouts) => {
    setViewsLayout(layout);
  };

  const handleScroll = useCallback(() => {
    if (containerRef.current && lineRef.current) {
      const scrollHeight = containerRef.current.scrollHeight;
      lineRef.current.style.height = `${scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    const currentcontainerRef = containerRef.current;

    if (currentcontainerRef) {
      currentcontainerRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentcontainerRef) {
        currentcontainerRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    setViewsStore(views);

    if (views?.findIndex((v) => v.video === chatId) === -1) {
      if (views.length) {
        setChatId(views[0].video);
      } else {
        setChatId("");
      }
    }
  }, [views]);

  useEffect(() => {
    setViewsLayoutStore(viewsLayout);
  }, [viewsLayout]);

  if (agencyIsLoading && liveDataIsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Head>
        <title>VTJoho - multi</title>
      </Head>
      <div className="relative flex h-full w-full overflow-hidden">
        <Sidebar
          viewsLayout={viewsLayout}
          setViewsLayout={setViewsLayout}
          setViews={setViews}
        />
        <div
          ref={containerRef}
          className="no-scrollbar relative h-full flex-auto overflow-y-scroll bg-light-100 dark:bg-dark-200"
        >
          <div ref={lineRef} className="bg-grid absolute h-full w-full"></div>
          <ReactGridLayout
            resizeHandles={["se"]}
            cols={{ lg: COLS, md: COLS, sm: COLS, xs: COLS, xxs: COLS }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            rowHeight={50}
            compactType={null}
            preventCollision={true}
            margin={[0, 0]}
            containerPadding={[1, 1]}
            draggableCancel=".stop-drag"
            onLayoutChange={(layout, layouts) => handleLayoutChange(layout, layouts)}
            onDragStart={() => setDragging(true)}
            onDragStop={() => setDragging(false)}
            className="relative"
          >
            {viewsLayout?.map((viewLayout) => {
              const view = views?.find((v) => v.i === viewLayout.i);
              return view?.video ? (
                <div
                  key={viewLayout.i}
                  data-grid={viewLayout}
                  className={`${
                    view.playing ? "p-0" : "p-6 pb-2"
                  } relative flex h-full select-none flex-col overflow-hidden border-2 border-primary/50 bg-light-300 dark:bg-dark-300`}
                >
                  <div
                    className={`${
                      dragging ? "absolute" : "none"
                    } top-0 left-0 right-0 bottom-0`}
                  ></div>
                  <ReactPlayer
                    url={`https://www.youtube.com/embed/${view.video}/?playsinline=1&&showinfo=0&enablejsapi=1&widgetid=${view.video}`}
                    playing={false}
                    controls={true}
                    width="100%"
                    height="100%"
                    className="h-full w-full bg-dark-300"
                    onPause={() => handleYtPause(viewLayout.i)}
                    onPlay={() => handleYtPlay(viewLayout.i)}
                  />
                  <div className={`${view.playing ? "hidden" : "flex"} justify-center`}>
                    <button
                      onClick={() => handleRemoveLive(viewLayout.i)}
                      className="stop-drag text-md m-2 mt-3 select-none rounded bg-red-500 py-1 px-2 text-light-100"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleReselectLive(viewLayout.i)}
                      className="stop-drag text-md m-2 mt-3 select-none rounded bg-primary py-1 px-2 text-light-100"
                    >
                      Reselect
                    </button>
                  </div>
                  <span
                    className={`${
                      view.playing ? "hidden" : "absolute"
                    } right-0 bottom-0 z-50 h-4 w-4 bg-primary `}
                  />
                </div>
              ) : (
                <div
                  key={viewLayout.i}
                  data-grid={viewLayout}
                  className="flex select-none flex-col items-center justify-center border-2 border-primary bg-light-300 dark:bg-dark-300"
                >
                  <button
                    onClick={(e) => handleSelectView(viewLayout.i, e)}
                    className="stop-drag my-2 rounded bg-primary p-2 text-2xl text-light-100"
                  >
                    Select Live
                  </button>
                  <button
                    onClick={(e) => handleRemoveView(viewLayout.i, e)}
                    className="stop-drag my-2 rounded bg-red-500 p-2 text-2xl text-light-100"
                  >
                    Remove
                  </button>
                  <span className="absolute right-0 bottom-0 z-50 block h-4 w-4 bg-primary" />
                </div>
              );
            })}
          </ReactGridLayout>
        </div>
        <Chat views={views} chatId={chatId} setChatId={setChatId} />
      </div>

      <MultiModal
        modalState={modalState}
        setModalState={setModalState}
        updateView={updateView}
        agencyData={agencyData}
        liveData={liveData}
        agencyIsLoading={agencyIsLoading}
        liveDataIsLoading={liveDataIsLoading}
        liveDataIsRefetching={liveDataIsRefetching}
        selectedLive={selectedLive}
        setSelectedLive={setSelectedLive}
      />
    </>
  );
};

export default Multi;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import { IVideoWithMember } from "@/query/vidoeQuery";
import { IAgency } from "@/query/agencyQuery";
import { LiveList, Modal } from "@/components/shared";
import { IModalState, ILiveInfo } from "@/pages/multi";
import agencyNameMap from "@/utils/map";
import "react-loading-skeleton/dist/skeleton.css";

interface IBaseProps {
  modalState: IModalState;
  setModalState: React.Dispatch<React.SetStateAction<IModalState>>;
  updateView: (id: string, updateFn: (view?: ILiveInfo) => ILiveInfo) => void;
  liveData: IVideoWithMember[] | undefined;
  agencyIsLoading: boolean;
  liveDataIsLoading: boolean;
  liveDataIsRefetching: boolean;
  agencyData: IAgency[] | undefined;
  selectedLive: string | undefined;
  setSelectedLive: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const MultiModal: React.FC<IBaseProps> = ({
  modalState,
  setModalState,
  updateView,
  liveData,
  agencyIsLoading,
  liveDataIsLoading,
  liveDataIsRefetching,
  agencyData,
  selectedLive,
  setSelectedLive,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<string>();
  const [filteredLiveData, setFilteredLiveData] = useState<
    IVideoWithMember[] | undefined
  >();

  const handleCloseModal = () => {
    setModalState({ isOpen: false });
    setSelectedLive(undefined);
    searchInputRef.current!.value = "";
    setSearchQuery(null);
  };

  const handleAddLive = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (modalState.id && selectedLive) {
      updateView(modalState.id, () => ({
        i: modalState.id!,
        playing: false,
        video: selectedLive,
        videoName:
          liveData?.find((data) => data.id === selectedLive)?.memberInfo.jpName ||
          selectedLive,
      }));
    }

    handleCloseModal();
  };

  const handleSelectedAgencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAgency(e.target.value);
    setSelectedLive(undefined);
    searchInputRef.current!.value = "";
    setSearchQuery(null);
  };

  const handleSelectedLiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLive(e.target.value);
  };

  const debounceFilter = useMemo(
    () =>
      debounce((query) => {
        setSearchQuery(query);
      }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounceFilter(e.target.value.toLowerCase());
  };

  const filterLiveByQuery = (lives: IVideoWithMember[] | undefined) => {
    if (!searchQuery) return lives;

    return lives?.filter((live) => {
      return (
        live.memberInfo.jpName.toLowerCase().includes(searchQuery) ||
        live.memberInfo.enName.toLowerCase().includes(searchQuery) ||
        live.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  useEffect(() => {
    if (!agencyIsLoading && !liveDataIsLoading && agencyData) {
      const agencyName = selectedAgency || agencyData[0]?.name;
      if (agencyName) {
        setSelectedAgency(agencyName);
        setFilteredLiveData(liveData?.filter((data) => data.agencyName === agencyName));
      }
    }
  }, [agencyIsLoading, liveDataIsLoading, agencyData, liveData, selectedAgency]);

  return (
    <Modal
      title="Select Live"
      submit="Confirm"
      isOpen={modalState?.isOpen || false}
      handleCloseModal={handleCloseModal}
      handleSubmit={handleAddLive}
    >
      {agencyIsLoading || liveDataIsLoading || liveDataIsRefetching ? (
        <div className="h-screen max-h-full max-w-full overflow-hidden">
          <div className="grid grid-cols-[repeat(auto-fill,1fr)] gap-4 sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} duration={1} count={1} height={100} baseColor="#68686B" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap">
            {agencyData?.map((agency) => (
              <label key={agency.name}>
                <input
                  type="radio"
                  value={agency.name}
                  className="peer hidden appearance-none"
                  checked={selectedAgency === agency.name}
                  onChange={handleSelectedAgencyChange}
                />
                <p className="cursor-pointer rounded-sm p-1.5 peer-checked:bg-primary">
                  {agencyNameMap[agency.name] || agency.name}
                </p>
              </label>
            ))}
          </div>
          <input
            ref={searchInputRef}
            type="text"
            name="search"
            placeholder="Search by name or title"
            className="my-2 rounded-sm border-[1px] border-dark-100 bg-transparent p-1 text-dark-100 dark:border-light-100 dark:text-light-100"
            onChange={handleSearchChange}
          />
          <div className="h-screen w-full overflow-auto px-2 py-3">
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
              {filterLiveByQuery(filteredLiveData)?.map((data) => (
                <label htmlFor={data.id} key={data.id} className="relative">
                  <input
                    type="radio"
                    id={data.id}
                    value={data.id}
                    className="peer hidden appearance-none"
                    checked={selectedLive === data.id}
                    onChange={handleSelectedLiveChange}
                  />
                  <div className="my-2 rounded-md bg-transparent py-1.5 px-1.5 transition-all duration-500 ease-in-out before:absolute before:-top-[7px] before:left-[13px] before:block before:h-[30px] before:w-[71px] before:rounded-3xl before:bg-transparent before:transition-all before:duration-500 before:ease-in-out before:content-[''] peer-checked:bg-primary peer-checked:before:bg-primary">
                    <LiveList {...data} route={false} />
                  </div>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default MultiModal;

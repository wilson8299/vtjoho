import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import { IAgency } from "@/query/agencyQuery";
import agencyNameMap from "@/utils/map";
import "swiper/css";
import "swiper/css/free-mode";

interface IBaseProps {
  agencyData: IAgency[];
  radioChecked: string;
  handleAgencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AgencyBar: React.FC<IBaseProps> = ({
  agencyData,
  radioChecked,
  handleAgencyChange,
}) => {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={30}
      freeMode={true}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode]}
      className="!container h-[48px] w-auto cursor-default"
    >
      {agencyData?.map((agency) => (
        <SwiperSlide
          key={agency.name}
          className="!m-0 flex !w-auto items-center text-xl dark:text-gray-100"
        >
          <input
            checked={radioChecked === agency.name}
            onChange={handleAgencyChange}
            value={agency.name}
            id={agency.name}
            type="radio"
            name="agencyRadio"
            className="peer hidden"
          />
          <label
            htmlFor={agency.name}
            className="block cursor-pointer border-b-[4px] border-transparent px-2 py-2 text-xl transition-colors duration-150 ease-in-out hover:border-sky-300 peer-checked:border-sky-500"
          >
            {agencyNameMap[agency.name] || agency.name}
          </label>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default AgencyBar;

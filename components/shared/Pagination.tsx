import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

interface IBaseProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<IBaseProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
}) => {
  const showNextButton = currentPage !== totalPages - 1;
  const showPrevButton = currentPage !== 0;

  return (
    <ReactPaginate
      breakLabel={<span>...</span>}
      nextLabel={
        showNextButton ? (
          <span className="ml-1 flex h-10 w-10 items-center justify-center rounded-md bg-primary sm:ml-2">
            <BsChevronRight />
          </span>
        ) : null
      }
      onPageChange={handlePageChange}
      pageRangeDisplayed={2}
      marginPagesDisplayed={1}
      pageCount={totalPages}
      renderOnZeroPageCount={() => null}
      previousLabel={
        showPrevButton ? (
          <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary sm:mr-4">
            <BsChevronLeft />
          </span>
        ) : null
      }
      containerClassName="flex items-center justify-center mt-8 mb-4"
      pageClassName="mr-1 sm:mr-2"
      pageLinkClassName="hover:bg-primary py-2 px-1 sm:px-3 flex items-center justify-center rounded-md border-none"
      activeClassName="bg-primary rounded-md text-white"
    />
  );
};

export default Pagination;

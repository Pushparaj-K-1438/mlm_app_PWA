// import IconCaretDown from "@/components/Icon/IconCaretDown";
interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
}

const MAX_PAGENUMBER_SHOW = 3;

const Pagination = ({
  currentPage = 1,
  totalRecords = 50,
  pageSize = 2,
  onPageChange = (page: any) => {},
}: PaginationProps) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_PAGENUMBER_SHOW / 2)
    );
    let endPage = Math.min(totalPages, startPage + MAX_PAGENUMBER_SHOW - 1);

    if (endPage - startPage < MAX_PAGENUMBER_SHOW - 1) {
      startPage = Math.max(1, endPage - MAX_PAGENUMBER_SHOW + 1);
    }
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === 1
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          } rounded-l-md  `}
          onClick={() => handlePageClick(1)}
          type="button"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="start-ellipsis">...</span>);
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            i === currentPage
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          } rounded-l-md `}
          onClick={() => handlePageClick(i)}
          type="button"
        >
          {i}
        </button>
      );
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis">...</span>);
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === totalPages
              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          } rounded-l-md  `}
          onClick={() => handlePageClick(totalPages)}
          type="button"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };
  return (
    <div>
      <ul className="inline-flex items-center space-x-1 rtl:space-x-reverse m-auto">
        {renderPageNumbers()}
      </ul>
    </div>
  );
};

export function PageInformation({
  totalRecords = 0,
  currentPage = 1,
  pageSize = 10,
  setPageSize = (pageSize: string | number) => {},
}) {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalRecords);
  return (
    <div className="mantine-Text-root mantine-k12qaq my-auto flex gap-2">
      <p className="text-sm text-gray-700">
        Showing <span className="font-medium">{startEntry}</span> to{" "}
        <span className="font-medium">{endEntry}</span> of{" "}
        <span className="font-medium">{totalRecords}</span> results
      </p>
      {/* <div className="my-auto dropdown">
        <Dropdown
          placement={`${true ? "top-start" : "top-end"}`}
          btnClassName="btn px-3 py-1 bg-gray  shadow-none "
          button={<>{pageSize}</>}
        >
          <ul className="!min-w-[170px]">
            {[10, 20, 30, 50, 100].map((item, key) => (
              <li
                key={key}
                className={` ${pageSize === item && "text-white-dark"}`}
              >
                <button
                  type="button"
                  disabled={pageSize === item}
                  onClick={() => setPageSize(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </Dropdown>
      </div> */}
    </div>
  );
}

export default Pagination;

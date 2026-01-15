import RcTable from "rc-table";
import Pagination, { PageInformation } from "../Pagination";
import Lib from "@/utils/Lib";
import Loader from "../ui/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";

const classes = {
  table: `
    p-4
    [&_.rc-table-content]:overflow-x-auto
    [&_table]:w-full
    [&_.rc-table-row:hover]:bg-gray-50
    [&_.rc-table-cell]:align-top
    [&_.rc-table-cell]:whitespace-nowrap
    [&_thead]:bg-gray-50
    [&_thead_>_th]:p-4
    [&_thead_>_th_>_div]:p-4
    [&_thead_>_th]:text-left
    [&_thead_>_th]:text-xs
    [&_thead_>_th]:font-medium
    [&_thead_>_th]:text-gray-500
    [&_thead_>_th]:uppercase
    [&_thead_>_th]:tracking-wider
    [&_tbody_>_td]:p-4
    [&_tbody_>_td_>_div]:p-4
    [&_tbody_>_td]:text-sm
    [&_tbody_>_td]:text-gray-700
    [&_.rc-table-container]:border
    [&_.rc-table-container]:border-gray-200
    [&_td.rc-table-cell]:border-b
    [&_td.rc-table-cell]:border-gray-200
    [&_thead]:border-b
    [&_thead]:border-gray-200
  `,
  mobile: `
    @media (max-width: 768px) {
      [&_.rc-table-content]:block
      [&_.rc-table-thead]:hidden
      [&_.rc-table-tbody]:block
      [&_.rc-table-row]:flex
      [&_.rc-table-row]:flex-col
      [&_.rc-table-row]:border-b
      [&_.rc-table-row]:border-gray-200
      [&_.rc-table-row]:mb-4
      [&_.rc-table-row]:pb-4
      [&_.rc-table-row]:last:border-b-0
      [&_.rc-table-row]:last:mb-0
      [&_.rc-table-cell]:block
      [&_.rc-table-cell]:w-full
      [&_.rc-table-cell]:px-4
      [&_.rc-table-cell]:py-2
      [&_.rc-table-cell]:border-none
      [&_.rc-table-cell]:border-b
      [&_.rc-table-cell]:border-gray-100
      [&_.rc-table-cell]:text-right
      [&_.rc-table-cell]:before:content-attr(data-label)
      [&_.rc-table-cell]:before:font-medium
      [&_.rc-table-cell]:before:text-gray-500
      [&_.rc-table-cell]:before:mr-2
      [&_.rc-table-cell]:before:float-left
    }
  `,
};

export default function TableUI({
  columns = [],
  data = [],
  totalRecords,
  pageSize,
  currentPage,
  onPageChange,
  isLoading = false,
  setPageSize = () => {},
  showMobileView = false,
}: any) {
  // Add data-label attributes for mobile view
  const mobileColumns = columns.map((col, index) => ({
    ...col,
    onCell: (record, rowIndex) => ({
      'data-label':
        col.title?.props?.title ?? col.title?.props?.children ?? (typeof col.title === 'string' ? col.title : ''),
    }),
  }));

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute bg-white bg-opacity-80 z-10 h-full w-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-sm text-gray-600">Loading data...</span>
          </div>
        </div>
      )}

      <div className={`${Lib.cn(classes.table)} ${showMobileView ? classes.mobile : ''}`}>
        <RcTable
          columns={mobileColumns}
          data={data}
          emptyText={
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No data available</p>
              <p className="text-gray-400 text-sm mt-1">There are no records to display</p>
            </div>
          }
          rowKey={(record: any, index: any) => index}
        />
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200">
        <PageInformation
          pageSize={pageSize}
          currentPage={currentPage}
          totalRecords={totalRecords}
          setPageSize={setPageSize}
        />
        {totalRecords > pageSize && (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, Math.ceil(totalRecords / pageSize)) }, (_, i) => {
                const pageNumber = i + 1;
                const totalPages = Math.ceil(totalRecords / pageSize);
                
                // Show first page, current page, and last page
                if (
                  pageNumber === 1 || 
                  pageNumber === currentPage || 
                  pageNumber === totalPages ||
                  (pageNumber === currentPage - 1 && currentPage > 2) ||
                  (pageNumber === currentPage + 1 && currentPage < totalPages - 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => onPageChange(pageNumber)}
                      className={`p-2 rounded-lg ${
                        pageNumber === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                
                // Show ellipsis for skipped pages
                if (
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return <span key={pageNumber} className="p-2">...</span>;
                }
                
                return null;
              })}
            </div>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === Math.ceil(totalRecords / pageSize)}
              className={`p-2 rounded-lg ${
                currentPage === Math.ceil(totalRecords / pageSize)
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
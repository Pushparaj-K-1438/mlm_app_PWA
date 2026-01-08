import RcTable from "rc-table";
import Pagination, { PageInformation } from "../Pagination";
import Lib from "@/utils/Lib";
import Loader from "../ui/Loader";

const classes = {
  table: `
    [&_.rc-table-content]:overflow-x-auto
    [&_table]:w-full
    [&_.rc-table-row:hover]:bg-gray-50
    [&_.rc-table-cell]:align-top
    [&_.rc-table-cell]:whitespace-nowrap
    [&_thead]:bg-gray-50
    [&_thead_th]:px-6
    [&_thead_th]:py-3
    [&_thead_th]:text-left
    [&_thead_th]:text-xs
    [&_thead_th]:font-medium
    [&_thead_th]:text-gray-500
    [&_thead_th]:uppercase
    [&_thead_th]:tracking-wider
    [&_tbody_td]:px-6
    [&_tbody_td]:py-4
    [&_tbody_td]:text-sm
    [&_tbody_td]:text-gray-700
  `,
  border: `
    [&_.rc-table-container]:border
    [&_.rc-table-container]:border-gray-200
    [&_td.rc-table-cell]:border-b
    [&_td.rc-table-cell]:border-gray-200
    [&_thead]:border-b
    [&_thead]:border-gray-200
  `,
  striped: `
    [&_.rc-table-row:nth-child(2n)_.rc-table-cell]:bg-gray-50/40
    [&_.rc-table-row:hover]:bg-gray-100/70
    transition-colors duration-150 ease-in-out
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
}: any) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
          <div className="flex items-center">
            <Loader />
          </div>
        </div>
      )}

      <RcTable
        className={Lib.cn(classes.table)}
        columns={columns}
        data={data}
        emptyText={<div className="py-5 text-center lg:py-8">No Data</div>}
        rowKey={(record: any, index: any) => index}
      />
      <div className="flex flex-col justify-center md:flex-row md:justify-between  my-3 p-1">
        <PageInformation
          pageSize={pageSize}
          currentPage={currentPage}
          totalRecords={totalRecords}
          setPageSize={setPageSize}
        />
        {totalRecords >= pageSize && (
          <Pagination
            pageSize={pageSize}
            currentPage={currentPage}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}

type TextAlign = "left" | "center" | "right";

export interface HeaderCellProps {
  title: React.ReactNode;
  width?: number | undefined;
  align?: TextAlign;
  ellipsis?: boolean;
  sortable?: boolean;
  sortDir?: "asc" | "desc" | undefined;
  sortBy?: string | undefined;
  iconClassName?: string;
  className?: string;
  keyName?: string;
  setSort?: ({ key, sort }: any) => void;
}

// A util func
function handleTextAlignment(align: TextAlign) {
  if (align === "center") return "justify-center";
  if (align === "right") return "justify-end";
  return "";
}

export function HeaderCell({
  title,
  align = "left",
  width,
  ellipsis,
  sortable,
  sortDir,
  sortBy,
  className,
  keyName = "",
  setSort = ({ key, sort }: any) => {},
}: HeaderCellProps) {
  const sortClick = () => {
    setSort({
      sort: sortDir ? (sortDir == "asc" ? "desc" : "asc") : "asc",
      key: keyName,
    });
  };
  return (
    <div
      className={Lib.cn(
        "flex items-center gap-1",
        sortable && "cursor-pointer",
        handleTextAlignment(align),
        className
      )}
      onClick={() => {
        if (sortable) {
          sortClick();
        }
      }}
    >
      <div
        {...(ellipsis && { className: "truncate" })}
        {...(width && { style: { width } })}
      >
        <b>{title}</b>
      </div>
      {sortable && (
        <div className="inline-flex">
          {sortDir && sortBy === keyName ? (
            sortDir == "desc" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  color: "black",
                  transform: "rotate3d(0, 0, 1, 180deg)",
                }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="18" y1="13" x2="12" y2="19"></line>
                <line x1="6" y1="13" x2="12" y2="19"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "black" }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="18" y1="13" x2="12" y2="19"></line>
                <line x1="6" y1="13" x2="12" y2="19"></line>
              </svg>
            )
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="mantine-9cumsf"
              viewBox="0 0 24 24"
              style={{ color: "rgb(173, 181, 189)" }}
            >
              <path stroke="none" d="M0 0h24v24H0z"></path>
              <path d="M8 7L12 3 16 7"></path>
              <path d="M8 17L12 21 16 17"></path>
              <path d="M12 3L12 21"></path>
            </svg>
          )}
        </div>
      )}
    </div>
  );
}

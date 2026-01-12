import  Lib  from "@/utils/Lib";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

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
  
  const getSortIcon = () => {
    if (!sortable) return null;
    
    if (sortDir && sortBy === keyName) {
      return sortDir === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    
    return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div
      className={Lib.cn(
        "flex items-center gap-2 py-2",
        sortable && "cursor-pointer hover:bg-gray-50 transition-colors",
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
        <span className="text-sm font-medium text-gray-900">{title}</span>
      </div>
      {sortable && (
        <div className="flex items-center">
          {getSortIcon()}
        </div>
      )}
    </div>
  );
}
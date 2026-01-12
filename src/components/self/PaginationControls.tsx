//@ts-nocheck
import React from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface PaginationControlsProps {
  itemsPerPage: number;
  changeItemsPerPage: (value: number) => void;
  page: number;
  handlePageChange: (page: number) => void;
  entriesStart: number;
  entriesEnd: number;
  count: number;
  itemsPerPageOptions?: number[];
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  itemsPerPage,
  changeItemsPerPage,
  page,
  handlePageChange,
  entriesStart,
  entriesEnd,
  count,
  itemsPerPageOptions = [5, 10, 25, 50],
}) => {
  const offset = (page - 1) * itemsPerPage;

  return (
    <div className="flex items-center justify-between mt-1 p-2">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-600">Show</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="xs">
              <span className="text-xs font-normal text-gray-600 p-1">{itemsPerPage}</span>
              <ChevronDown className="h-2 w-2 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-12 bg-white">
            {itemsPerPageOptions.map((option) => (
              <DropdownMenuItem key={option} onClick={() => changeItemsPerPage(option)}>
                <span className="text-xs font-normal text-gray-600 p-1">{option}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="text-xs text-gray-600">entries</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="xs"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>

        <span className="text-xs">
          {entriesStart}-{entriesEnd} of {count}
        </span>

        <Button
          variant="outline"
          size="xs"
          onClick={() => handlePageChange(page + 1)}
          disabled={offset + itemsPerPage >= count}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationControls;

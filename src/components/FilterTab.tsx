import { useQueryParams } from "@/hooks";
import { Filter, RefreshCw, Search, X } from "lucide-react";
import SelectInput from "./ui/SelectInput";
import { OPTIONS } from "@/constants/others";
import InputText from "./ui/InputText";
import { useState } from "react";

const FILTER_FIELD = {
  SEARCH: {
    type: "search",
    name: "search",
  },
  PROMOTER_LEVEL: {
    type: "select_input",
    name: "current_promoter_level",
    options: OPTIONS.PROMOTER_LEVEL,
    label: "Select Promoter Level",
  },
  PROMOTER_LEVEL_PIN: {
    type: "select_input",
    name: "level",
    options: OPTIONS.PROMOTER_LEVEL,
    label: "Select Promoter Level",
  },
  PIN_STATUS: {
    type: "select_input",
    name: "status",
    options: OPTIONS.PIN_STATUS,
    label: "Select Status",
  },
  FROM_DATE: {
    type: "date",
    name: "fromdate",
    label: "Joined From",
  },
  TO_DATE: {
    type: "date",
    name: "todate",
    label: "Joined To",
  },

  FROM_DATE_PIN: {
    type: "date",
    name: "fromdate",
    label: "Request From",
  },
  TO_DATE_PIN: {
    type: "date",
    name: "todate",
    label: "Request To",
  },
};

const FilterTab = ({ filter, setFilter, TABLE_FILTER }) => {
  const { defaultFilter } = useQueryParams();
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = TABLE_FILTER.some(field => {
    if (field === "SEARCH") {
      return filter.search && filter.search.trim() !== "";
    }
    return filter.filter && filter.filter[FILTER_FIELD[field].name];
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filter Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-blue-600 font-medium"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
          </button>
        </div>
        <button
          onClick={() => setFilter((prv) => ({ ...defaultFilter }))}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar (Always Visible) */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search earnings..."
            value={filter.search || ""}
            onChange={(e) =>
              setFilter((prv) => ({
                ...prv,
                search: e.target.value,
                pageNo: 1,
              }))
            }
            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {filter.search && (
            <button
              onClick={() =>
                setFilter((prv) => ({
                  ...prv,
                  search: "",
                  pageNo: 1,
                }))
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Additional Filters (Collapsible) */}
      {showFilters && (
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            {TABLE_FILTER.filter(field => field !== "SEARCH").map((fields) => {
              switch (FILTER_FIELD[fields].type) {
                case "select_input":
                  return (
                    <SelectInput
                      key={fields}
                      name={FILTER_FIELD[fields]?.name}
                      label={FILTER_FIELD[fields]?.label}
                      placeholder={FILTER_FIELD[fields]?.label}
                      value={filter?.filter?.[FILTER_FIELD[fields].name] || ""}
                      options={FILTER_FIELD[fields].options}
                      onChange={(e) =>
                        setFilter((prv) => ({
                          ...prv,
                          filter: {
                            ...prv.filter,
                            [FILTER_FIELD[fields].name]: e.target.value,
                          },
                          pageNo: 1,
                        }))
                      }
                    />
                  );
                case "date":
                  return (
                    <InputText
                      key={fields}
                      type={"date"}
                      label={FILTER_FIELD[fields]?.label}
                      value={filter?.filter?.[FILTER_FIELD[fields].name] || ""}
                      name={FILTER_FIELD[fields].name}
                      onChange={(e) =>
                        setFilter((prv) => ({
                          ...prv,
                          filter: {
                            ...prv.filter,
                            [FILTER_FIELD[fields].name]: e.target.value,
                          },
                          pageNo: 1,
                        }))
                      }
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterTab;
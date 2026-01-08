import { useQueryParams } from "@/hooks";
import { RefreshCw } from "lucide-react";
import SelectInput from "./ui/SelectInput";
import { OPTIONS } from "@/constants/others";
import InputText from "./ui/InputText";

const SearchInput = ({ value, onChange }) => {
  return (
    <div className="md:col-span-1">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Search
      </label>
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

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
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 mb-6">
      <div className="flex items-start justify-between ">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {TABLE_FILTER.map((fields) => {
              switch (FILTER_FIELD[fields].type) {
                case "search":
                  return (
                    <SearchInput
                      key={fields}
                      value={filter[FILTER_FIELD[fields].name]}
                      onChange={(e: any) =>
                        setFilter((prv) => ({
                          ...prv,
                          search: e.target.value,
                          pageNo: 1,
                        }))
                      }
                    />
                  );
                case "select_input":
                  return (
                    <SelectInput
                      key={fields}
                      name={FILTER_FIELD[fields]?.name}
                      label={FILTER_FIELD[fields]?.label}
                      placeholder={FILTER_FIELD[fields]?.label}
                      value={filter?.filter}
                      options={FILTER_FIELD[fields].options}
                      onChange={(e: any) =>
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
                      value={filter?.filter}
                      name={FILTER_FIELD[fields]?.name}
                      onChange={(e: any) =>
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
        <div className="p-6">
          <div
            onClick={() => setFilter((prv) => ({ ...defaultFilter }))}
            className="cursor-pointer p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <RefreshCw />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTab;

import TableUI from "./TableUi";
import { HeaderCell } from "./HeaderCell";

const DataTable = ({
  columns = [],
  data = [],
  totalRecords = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange = (page: any) => {},
  setSort = ({ key, sort }: any) => {},
  isLoading = false,
  sortDir = "",
  sortBy = "",
  setPageSize = () => {},
}: any) => {
  const getColumns = (parttenArg: any): any => {
    let col: any = [];
    parttenArg.map((element: any) => {
      col.push({
        title: (
          <HeaderCell
            title={element.title ?? "Title"}
            sortable={element.sortable ?? false}
            align={element.align ?? "left"}
            keyName={element?.key ?? "name"}
            width={element?.width}
            setSort={setSort}
            sortDir={sortDir}
            sortBy={sortBy}
          />
        ),
        dataIndex: element?.key ?? "name",
        key: element?.key ?? "name",
        render: element?.render,
      });
    });
    return col;
  };

  const getDataWithEmbedSerial = (inputData: any[] = []) => {
    let tData: any = [];
    inputData.map((item, index) =>
      tData.push({
        "#":
          currentPage == 1
            ? index + 1
            : (currentPage - 1) * pageSize + index + 1,
        ...item,
      })
    );

    return tData;
  };

  return (
    <TableUI
      columns={getColumns(columns)}
      data={getDataWithEmbedSerial(data)}
      totalRecords={totalRecords}
      pageSize={pageSize}
      currentPage={currentPage}
      onPageChange={onPageChange}
      isLoading={isLoading}
      setPageSize={setPageSize}
      showMobileView={true}
    />
  );
};

export default DataTable;
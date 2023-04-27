import React, { useEffect, useState } from "react";

import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  CellContext as TanCellContext,
} from "@tanstack/react-table";
import {
  GTFSTextHeaders,
  RouteTableRow,
  ScheduleObject,
} from "../helpers/types";
import { readGSTFile } from "../helpers/api";
import { EnableFilter, GTFSConfig, MapGTFSHeaders } from "../helpers/constants";
import { useScheduleStore, useURLStore } from "../store/store";
import ColumnFilter from "./ColumnFilter";
import { Router, useRouter } from "next/router";

const columnHelper = createColumnHelper<RouteTableRow>();

type CellContext<TData extends RouteTableRow, TValue> = TanCellContext<
  TData,
  TValue
> & {
  router: Router;
};

const columns = [
  columnHelper.accessor("plate_no", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("route_no", {
    cell: (info: unknown) => {
      const infoCasted = info as CellContext<RouteTableRow, string>;
      return (
        <div className="">
          <a
            className="font-medium text-blue-600 cursor-pointer dark:text-blue-500 hover:underline"
            onClick={async (e) => {
              const selectedRoute: string = infoCasted.row.getValue("route_no");
              const selectedBus: string = infoCasted.row.getValue("plate_no");

              const startTime: string =
                infoCasted.row.getValue("trip_start_time");
              const endTime: string = infoCasted.row.getValue("trip_end_time");
              infoCasted.router.push({
                pathname: "/",
                query: {
                  agency_id: useURLStore.getState().agency_id,
                  route_id: selectedRoute.toUpperCase(),
                },
              });
            }}
          >
            {infoCasted.getValue().toUpperCase()}
          </a>
        </div>
      );
    },
  }),
  columnHelper.accessor("trip_start_time", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("trip_end_time", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
];

function RouteTable() {
  const router = useRouter();
  const setRouteList = useScheduleStore((state) => state.setRouteList);

  const routeList = useScheduleStore((state) => state.routeList);
  const [filepath] = useState<string>(GTFSConfig.url);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable<RouteTableRow>({
    columns,
    data: routeList,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    readGSTFile<GTFSTextHeaders, ScheduleObject>(filepath, MapGTFSHeaders).then(
      (data) => {
        setRouteList(data);
      }
    );
  }, []);

  return (
    <div className="w-full h-full bg-white text-zinc-700">
      <table className="w-full h-[80%] min-w-full p-2 overflow-hidden divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 text-xs font-bold tracking-wider text-left text-gray-500 uppercase"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getCanFilter() &&
                  EnableFilter.includes(
                    header.column.id as keyof RouteTableRow
                  ) ? (
                    <div>
                      <ColumnFilter column={header.column} table={table} />
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="h-[100%] bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-2 text-xs break-words whitespace-normal"
                >
                  {/* {flexRender(cell.column.columnDef.cell, cell.getContext())} */}
                  {flexRender(cell.column.columnDef.cell, {
                    ...cell.getContext(),
                    router,
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-around p-2 space-x-2 bg-white">
        <button
          className="px-2 border rounded shadow-xs"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="px-2 border rounded"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="px-2 border rounded"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="px-2 border rounded"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 p-2 my-2 border rounded"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="py-2 mr-2 border rounded"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default RouteTable;
9;

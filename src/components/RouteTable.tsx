import React, { useEffect, useState } from "react";

import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { RouteTableRow, ScheduleObject } from "../helpers/types";
import { readGSTFile } from "../helpers/api";
import { GTFSConfig } from "../helpers/constants";
import { useScheduleStore } from "../store/store";
import Filter from "./Filter";

const columnHelper = createColumnHelper<RouteTableRow>();

const columns = [
  columnHelper.accessor("duty_id", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("plate_no", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("route_no", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("trip_end_time", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("trip_start_time", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.accessor("trip_number", {
    cell: (info) => <div>{info.getValue()}</div>,
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <div className="">
        <button className="w-auto px-4 py-1 text-xs text-blue-700 bg-transparent border border-blue-500 rounded font-xs hover:bg-blue-500 hover:text-white hover:border-transparent">
          Get Route
        </button>
      </div>
    ),
  }),
];

function RouteTable() {
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
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    readGSTFile(filepath).then((data) => {
      setRouteList(data);
    });
  }, []);

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "duty_id") {
      if (table.getState().sorting[0]?.id !== "duty_id") {
        table.setSorting([{ id: "duty_id", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  return (
    <div className="w-full h-[30%] overflow-auto bg-white text-zinc-700">
      <div className="flex items-center justify-end px-4 space-x-2">
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
      <table className="w-full h-[300px] overflow-auto p-2 min-w-full divide-y divide-gray-200">
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
                  {header.column.getCanFilter() ? (
                    <div>
                      <Filter column={header.column} table={table} />
                    </div>
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 text-xs whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RouteTable;
9;

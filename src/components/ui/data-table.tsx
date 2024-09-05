"use client";

// Custom components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CustomModal from "../dashboard/shared/custom-modal";

// Table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tanstack react table
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Lucide icons
import { FilePlus2, Search } from "lucide-react";

// Modal provider hook
import { useModal } from "@/providers/modal-provider";
import Link from "next/link";

// Props interface for the table component
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterValue: string;
  actionButtonText?: React.ReactNode;
  modalChildren?: React.ReactNode;
  newTabLink?: string;
  searchPlaceholder: string;
  heading?: string;
  subheading?: string;
  noHeader?: true;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterValue,
  modalChildren,
  actionButtonText,
  searchPlaceholder,
  heading,
  subheading,
  noHeader,
  newTabLink,
}: DataTableProps<TData, TValue>) {
  // Modal state
  const { setOpen } = useModal();

  // React table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      {/* Search input and action button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center py-4 gap-2">
          <Search />
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(filterValue)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterValue)?.setFilterValue(event.target.value)
            }
            className="h-12"
          />
        </div>
        <div className="flex gap-x-2">
          {modalChildren && (
            <Button
              className="flex- gap-2"
              onClick={() => {
                if (modalChildren)
                  setOpen(
                    <CustomModal
                      heading={heading || ""}
                      subheading={subheading || ""}
                    >
                      {modalChildren}
                    </CustomModal>
                  );
              }}
            >
              {actionButtonText}
            </Button>
          )}
          {newTabLink && (
            <Link href={newTabLink}>
              <Button variant="outline">
                <FilePlus2 className="me-1" /> Create in new page
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className=" border bg-background rounded-lg">
        <Table className="">
          {/* Table header */}
          {!noHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          )}

          {/* Table body */}
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-[400px] break-words"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              // No results message
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

import React from 'react';

export interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowKey: (item: T) => string | number;
}

export function Table<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  rowKey,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded shadow-premium">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/50">
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider ${
                  column.className || ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            // Render Skeleton rows
            Array.from({ length: 5 }).map((_, rIdx) => (
              <tr key={rIdx}>
                {columns.map((_, cIdx) => (
                  <td key={cIdx} className="px-6 py-4.5">
                    <div className="h-4 bg-slate-100 animate-pulse rounded w-3/4"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="text-sm font-medium text-slate-400">{emptyMessage}</div>
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={rowKey(item)}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors leading-normal ${
                  onRowClick ? 'hover:bg-slate-50/60 cursor-pointer' : ''
                }`}
              >
                {columns.map((column, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-6 py-4 text-sm text-slate-700 font-medium ${
                      column.className || ''
                    }`}
                  >
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

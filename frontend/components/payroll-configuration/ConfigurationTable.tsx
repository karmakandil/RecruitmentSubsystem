"use client";

import React from 'react';
import { StatusBadge, ConfigStatus } from './StatusBadge';
import { Button } from '@/components/shared/ui/Button';

export interface ConfigurationItem {
  _id?: string;
  id?: string;
  status: ConfigStatus;
  [key: string]: any;
}

interface ConfigurationTableProps<T extends ConfigurationItem> {
  data: T[];
  columns: {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onApprove?: (item: T) => void;
  onReject?: (item: T) => void;
  onView?: (item: T) => void;
  showStatus?: boolean;
  canEdit?: (item: T) => boolean;
  canDelete?: (item: T) => boolean;
  canApprove?: (item: T) => boolean;
  canReject?: (item: T) => boolean;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ConfigurationTable<T extends ConfigurationItem>({
  data,
  columns,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onView,
  showStatus = true,
  canEdit = (item) => item.status === 'draft',
  canDelete = (item) => item.status === 'draft',
  canApprove = () => false,
  canReject = () => false,
  isLoading = false,
  emptyMessage = 'No configurations found',
}: ConfigurationTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
            {showStatus && (
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => {
            const itemId = item._id || item.id || '';
            return (
              <tr key={itemId} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className={`whitespace-nowrap px-6 py-4 text-sm text-gray-900 ${column.className || ''}`}>
                    {column.render ? column.render(item) : (item[column.key] as string) || '-'}
                  </td>
                ))}
                {showStatus && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                )}
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(item)}
                      >
                        View
                      </Button>
                    )}
                    {onEdit && canEdit(item) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>
                    )}
                    {onApprove && canApprove(item) && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onApprove(item)}
                      >
                        Approve
                      </Button>
                    )}
                    {onReject && canReject(item) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(item)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Reject
                      </Button>
                    )}
                    {onDelete && canDelete(item) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(item)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ConfigurationTable;

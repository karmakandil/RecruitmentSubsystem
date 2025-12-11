"use client";

import React from 'react';
import { StatusBadge, ConfigStatus } from './StatusBadge';
import { Button } from '@/components/shared/ui/Button';

export interface ConfigurationItem {
  _id: string;
  status: ConfigStatus;
  [key: string]: any;
}

interface ConfigurationTableProps<T extends ConfigurationItem> {
  data: T[];
  columns: {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
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
        <p className="text-gray-500">No configurations found</p>
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
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
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
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                  {column.render ? column.render(item) : (item[column.key] as string)}
                </td>
              ))}
              {showStatus && (
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <StatusBadge status={item.status} />
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
          ))}
        </tbody>
      </table>
    </div>
  );
}


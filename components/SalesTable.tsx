
import React from 'react';
import { SaleRecord } from '../types';
import { EditIcon, DeleteIcon } from './Icons';

interface SalesTableProps {
  sales: SaleRecord[];
  onEdit?: (record: SaleRecord) => void;
  onDelete?: (id: number) => void;
  visibleColumns: Record<string, boolean>;
  isAdmin: boolean;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, onEdit, onDelete, visibleColumns, isAdmin }) => {
    
  const getVisibleHeaders = () => {
      return Object.entries(visibleColumns)
          .filter(([, isVisible]) => isVisible)
          .map(([key]) => key);
  };
  
  const headers = getVisibleHeaders();
  
  const formatHeader = (header: string) => {
    return header.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                {formatHeader(header)}
              </th>
            ))}
            {isAdmin && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {sales.map((sale) => (
            <tr key={sale.id} className="hover:bg-gray-700">
              {headers.map((header) => (
                  <td key={`${sale.id}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {header === 'image' && sale.image ? (
                          <img src={sale.image} alt={sale.productName} className="w-16 h-16 object-cover rounded"/>
                      ) : (
                          // @ts-ignore
                          sale[header]
                      )}
                  </td>
              ))}

              {isAdmin && onEdit && onDelete && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <button onClick={() => onEdit(sale)} className="text-indigo-400 hover:text-indigo-300">
                      <EditIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(sale.id)} className="text-red-400 hover:text-red-300">
                      <DeleteIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {sales.length === 0 && <p className="text-center py-8 text-gray-500">No records found.</p>}
    </div>
  );
};

export default SalesTable;

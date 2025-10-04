
import React from 'react';

interface FilterControlsProps {
  dateRange: { from: string; to: string };
  setDateRange: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>;
  timeRange: { from: string; to: string };
  setTimeRange: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>;
  allColumns: string[];
  visibleColumns: Record<string, boolean>;
  setVisibleColumns: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onConfigureCustomerView: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  dateRange, setDateRange, timeRange, setTimeRange, allColumns, visibleColumns, setVisibleColumns, onConfigureCustomerView
}) => {
  const handleColumnToggle = (col: string) => {
    setVisibleColumns(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div className="bg-gray-900 p-4 rounded-md mb-4 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Date From</label>
          <input type="date" value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))} className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Date To</label>
          <input type="date" value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))} className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Time From</label>
          <input type="time" value={timeRange.from} onChange={e => setTimeRange(p => ({ ...p, from: e.target.value }))} className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Time To</label>
          <input type="time" value={timeRange.to} onChange={e => setTimeRange(p => ({ ...p, to: e.target.value }))} className="w-full bg-gray-700 text-white rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Visible Columns (Admin View)</label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {allColumns.map(col => (
            <label key={col} className="flex items-center space-x-2 text-sm text-gray-200">
              <input type="checkbox" checked={visibleColumns[col] ?? false} onChange={() => handleColumnToggle(col)} className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"/>
              <span>{col.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button onClick={onConfigureCustomerView} className="text-sm text-indigo-400 hover:text-indigo-300">
              Configure Customer View Permissions &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;

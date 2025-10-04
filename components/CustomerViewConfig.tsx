
import React from 'react';

interface CustomerViewConfigProps {
  allColumns: string[];
  visibleFields: Record<string, boolean>;
  setVisibleFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onClose: () => void;
}

const CustomerViewConfig: React.FC<CustomerViewConfigProps> = ({
  allColumns,
  visibleFields,
  setVisibleFields,
  onClose,
}) => {
  const handleToggle = (col: string) => {
    setVisibleFields(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const formatHeader = (header: string) => {
    return header.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Configure Customer View</h2>
        <p className="text-gray-400 mb-6">Select the data fields that all customers will be able to see on their dashboard.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
          {allColumns.map(col => (
            <label key={col} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600">
              <input 
                type="checkbox" 
                checked={visibleFields[col] ?? false} 
                onChange={() => handleToggle(col)} 
                className="h-5 w-5 rounded bg-gray-900 border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-200">{formatHeader(col)}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button 
            onClick={onClose} 
            className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerViewConfig;

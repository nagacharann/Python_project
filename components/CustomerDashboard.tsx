
import React from 'react';
import { User, SaleRecord } from '../types';
import SalesTable from './SalesTable';
import { LogoutIcon } from './Icons';

interface CustomerDashboardProps {
  currentUser: User;
  onLogout: () => void;
  sales: SaleRecord[];
  visibleFields: Record<string, boolean>;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ currentUser, onLogout, sales, visibleFields }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Customer Dashboard</h1>
          <p className="text-gray-400">Welcome, {currentUser.username}</p>
        </div>
        <button
            onClick={onLogout}
            className="p-2 text-gray-400 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-white"
        >
            <LogoutIcon className="w-6 h-6" />
        </button>
      </header>

      <main>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Your Sales Records</h2>
          <SalesTable 
            sales={sales}
            visibleColumns={visibleFields}
            isAdmin={false}
          />
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;

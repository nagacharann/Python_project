
import React, { useState, useMemo, useCallback } from 'react';
import { User, SaleRecord, Role } from '../types';
import SalesTable from './SalesTable';
import UserManagement from './UserManagement';
import RecordForm from './RecordForm';
import FilterControls from './FilterControls';
import { LogoutIcon, UserIcon, PlusIcon, SparklesIcon } from './Icons';
import { analyzeSalesData } from '../services/geminiService';
import CustomerViewConfig from './CustomerViewConfig';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  sales: SaleRecord[];
  setSales: React.Dispatch<React.SetStateAction<SaleRecord[]>>;
  customerVisibleFields: Record<string, boolean>;
  setCustomerVisibleFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  addNewUser: (user: User) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser, onLogout, users, setUsers, sales, setSales, customerVisibleFields, setCustomerVisibleFields, addNewUser
}) => {
  const [isRecordFormOpen, setIsRecordFormOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isCustomerViewConfigOpen, setIsCustomerViewConfigOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SaleRecord | null>(null);

  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [timeRange, setTimeRange] = useState({ from: '', to: '' });
  
  const allColumns = useMemo(() => 
    sales.length > 0 ? Object.keys(sales[0]).filter(k => k !== 'id') : [], 
  [sales]);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    allColumns.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;

      if (fromDate && saleDate < fromDate) return false;
      if (toDate && saleDate > toDate) return false;

      const saleTime = sale.time;
      const fromTime = timeRange.from;
      const toTime = timeRange.to;

      if (fromTime && saleTime < fromTime) return false;
      if (toTime && saleTime > toTime) return false;

      return true;
    });
  }, [sales, dateRange, timeRange]);
  
  const handleEdit = (record: SaleRecord) => {
    setEditingRecord(record);
    setIsRecordFormOpen(true);
  };
  
  const handleDelete = (id: number) => {
    setSales(sales.filter(s => s.id !== id));
  };
  
  const handleSaveRecord = (record: SaleRecord) => {
    if (editingRecord) {
      setSales(sales.map(s => s.id === record.id ? record : s));
    } else {
      const newRecord = { ...record, id: Date.now() };
      setSales([...sales, newRecord]);

      // Auto-create user
      const formattedUsername = newRecord.customerName.replace(/\s+/g, '').toUpperCase();
      const customerExists = users.some(u => u.username === formattedUsername);
      if (!customerExists) {
        const newUser: User = {
          id: Date.now(),
          username: formattedUsername,
          password: newRecord.customerId,
          role: Role.Customer
        };
        addNewUser(newUser);
      }
    }
    setEditingRecord(null);
    setIsRecordFormOpen(false);
  };

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    setAiAnalysis('');
    const result = await analyzeSalesData(filteredSales);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  }, [filteredSales]);


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome, {currentUser.username}</p>
        </div>
        <div className="flex items-center space-x-4">
            <button
                onClick={() => setIsUserManagementOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
            >
                <UserIcon className="w-5 h-5 mr-2" />
                User Management
            </button>
            <button
                onClick={onLogout}
                className="p-2 text-gray-400 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-white"
            >
                <LogoutIcon className="w-6 h-6" />
            </button>
        </div>
      </header>

      <main>
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <h2 className="text-xl font-semibold text-white mb-4 md:mb-0">Sales Records</h2>
              <div className="flex items-center space-x-2">
                 <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                </button>
                <button
                    onClick={() => {
                        setEditingRecord(null);
                        setIsRecordFormOpen(true);
                    }}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Record
                </button>
              </div>
          </div>

          {isAnalyzing && <div className="text-center p-4 text-gray-400">AI is thinking...</div>}
          {aiAnalysis && (
              <div className="prose prose-invert max-w-none bg-gray-900 p-4 rounded-md mb-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-purple-400">Gemini Sales Analysis</h3>
                  {aiAnalysis.split('\n').map((line, i) => {
                      if (line.startsWith('- ')) return <p key={i} className="my-1 ml-4">{line}</p>;
                      if (line.match(/^#+\s/)) return <h4 key={i} className="font-bold text-gray-200 mt-2">{line.replace(/^#+\s/, '')}</h4>;
                      return <p key={i} className="my-1">{line}</p>
                  })}
              </div>
          )}

          <FilterControls
            dateRange={dateRange}
            setDateRange={setDateRange}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            allColumns={allColumns}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            onConfigureCustomerView={() => setIsCustomerViewConfigOpen(true)}
          />
          <SalesTable 
            sales={filteredSales}
            onEdit={handleEdit}
            onDelete={handleDelete}
            visibleColumns={visibleColumns}
            isAdmin={true}
          />
        </div>
      </main>

      {isRecordFormOpen && (
        <RecordForm
          record={editingRecord}
          onSave={handleSaveRecord}
          onClose={() => {
            setIsRecordFormOpen(false);
            setEditingRecord(null);
          }}
          sales={sales}
        />
      )}
      {isUserManagementOpen && (
          <UserManagement
              users={users}
              setUsers={setUsers}
              onClose={() => setIsUserManagementOpen(false)}
          />
      )}
      {isCustomerViewConfigOpen && (
        <CustomerViewConfig
          allColumns={allColumns}
          visibleFields={customerVisibleFields}
          setVisibleFields={setCustomerVisibleFields}
          onClose={() => setIsCustomerViewConfigOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

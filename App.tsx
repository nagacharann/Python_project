
import React, { useState, useEffect } from 'react';
import { User, SaleRecord, Role } from './types';
import { INITIAL_USERS, INITIAL_SALES_RECORDS } from './constants';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Login from './components/Login';
import { DUMMY_VISIBLE_FIELDS } from './constants';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [sales, setSales] = useState<SaleRecord[]>(INITIAL_SALES_RECORDS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customerVisibleFields, setCustomerVisibleFields] = useState<Record<string, boolean>>(DUMMY_VISIBLE_FIELDS);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addNewUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  }

  if (!currentUser) {
    return <Login users={users} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {currentUser.role === Role.Admin ? (
        <AdminDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          users={users}
          setUsers={setUsers}
          sales={sales}
          setSales={setSales}
          customerVisibleFields={customerVisibleFields}
          setCustomerVisibleFields={setCustomerVisibleFields}
          addNewUser={addNewUser}
        />
      ) : (
        <CustomerDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
          sales={sales.filter(s => s.customerName.replace(/\s+/g, '').toUpperCase() === currentUser.username)}
          visibleFields={customerVisibleFields}
        />
      )}
    </div>
  );
};

export default App;

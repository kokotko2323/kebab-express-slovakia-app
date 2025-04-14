
import React, { useState } from 'react';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import DashboardTabs from '@/components/admin/DashboardTabs';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import RestaurantSettings from './RestaurantSettings';
import { useAdmin } from '@/hooks/useAdmin';
import { useRestaurantData } from '@/hooks/useRestaurantData';

type TabType = 'orders' | 'users' | 'settings';

const Dashboard = () => {
  const { isAdmin, isLoading, handleLogout } = useAdmin();
  const { 
    ordersCount, 
    pendingOrders, 
    totalRevenue, 
    usersCount, 
    isRestaurantOpen, 
    fetchDashboardData, 
    toggleRestaurantStatus 
  } = useRestaurantData();
  
  const [activeTab, setActiveTab] = useState<TabType>('orders');

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader 
        isRestaurantOpen={isRestaurantOpen}
        toggleRestaurantStatus={toggleRestaurantStatus}
        handleLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DashboardStats 
          ordersCount={ordersCount}
          pendingOrders={pendingOrders}
          totalRevenue={totalRevenue}
          usersCount={usersCount}
        />
        
        <DashboardTabs 
          activeTab={activeTab}
          pendingOrders={pendingOrders}
          setActiveTab={setActiveTab}
        />
        
        {activeTab === 'orders' && <OrderManagement onOrderUpdate={fetchDashboardData} />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'settings' && <RestaurantSettings />}
      </main>
    </div>
  );
};

export default Dashboard;

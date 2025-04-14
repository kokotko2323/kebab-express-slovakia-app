
import React, { useState } from 'react';
import DashboardHeader from '@/components/admin/DashboardHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import DashboardTabs from '@/components/admin/DashboardTabs';
import OrderManagement from './OrderManagement';
import RestaurantSettings from './RestaurantSettings';
import { useAdmin } from '@/hooks/useAdmin';
import { useRestaurantData } from '@/hooks/useRestaurantData';

type TabType = 'orders' | 'settings';

const Dashboard = () => {
  const { isAdmin, isLoading, handleLogout } = useAdmin();
  const { 
    ordersCount, 
    pendingOrders, 
    totalRevenue, 
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
          usersCount={0}
        />
        
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'orders'
                  ? 'text-kebab-primary border-b-2 border-kebab-primary'
                  : 'text-gray-500 hover:text-kebab-primary'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Objednávky {pendingOrders > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                  {pendingOrders}
                </span>
              )}
            </button>
            
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'text-kebab-primary border-b-2 border-kebab-primary'
                  : 'text-gray-500 hover:text-kebab-primary'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Nastavenia
            </button>
          </div>
        </div>
        
        {activeTab === 'orders' && <OrderManagement onOrderUpdate={fetchDashboardData} />}
        {activeTab === 'settings' && <RestaurantSettings />}
      </main>
    </div>
  );
};

export default Dashboard;

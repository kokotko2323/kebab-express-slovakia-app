
import React from 'react';

interface DashboardStatsProps {
  ordersCount: number;
  pendingOrders: number;
  totalRevenue: number;
  usersCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  ordersCount,
  pendingOrders,
  totalRevenue,
  usersCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Celkový počet objednávok</h2>
        <p className="text-3xl font-bold text-kebab-primary">{ordersCount}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Aktívne objednávky</h2>
        <p className="text-3xl font-bold text-kebab-primary">{pendingOrders}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Tržby celkom</h2>
        <p className="text-3xl font-bold text-kebab-primary">{totalRevenue.toFixed(2)} €</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-sm font-medium text-gray-500 mb-1">Registrovaní zákazníci</h2>
        <p className="text-3xl font-bold text-kebab-primary">{usersCount}</p>
      </div>
    </div>
  );
};

export default DashboardStats;

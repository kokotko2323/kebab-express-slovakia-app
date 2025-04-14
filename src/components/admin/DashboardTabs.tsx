
import React from 'react';
import { Settings, Users, ShoppingBag } from 'lucide-react';

type TabType = 'orders' | 'users' | 'settings';

interface DashboardTabsProps {
  activeTab: TabType;
  pendingOrders: number;
  setActiveTab: (tab: TabType) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  pendingOrders,
  setActiveTab
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="flex border-b overflow-x-auto">
        <button
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'orders'
              ? 'text-kebab-primary border-b-2 border-kebab-primary'
              : 'text-gray-500 hover:text-kebab-primary'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <div className="flex items-center">
            <ShoppingBag size={18} className="mr-2" />
            Objednávky
            {pendingOrders > 0 && (
              <span className="ml-2 bg-kebab-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {pendingOrders}
              </span>
            )}
          </div>
        </button>
        
        <button
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'users'
              ? 'text-kebab-primary border-b-2 border-kebab-primary'
              : 'text-gray-500 hover:text-kebab-primary'
          }`}
          onClick={() => setActiveTab('users')}
        >
          <div className="flex items-center">
            <Users size={18} className="mr-2" />
            Zákazníci
          </div>
        </button>
        
        <button
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
            activeTab === 'settings'
              ? 'text-kebab-primary border-b-2 border-kebab-primary'
              : 'text-gray-500 hover:text-kebab-primary'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <div className="flex items-center">
            <Settings size={18} className="mr-2" />
            Nastavenia
          </div>
        </button>
      </div>
    </div>
  );
};

export default DashboardTabs;

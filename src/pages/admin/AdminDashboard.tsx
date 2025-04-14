
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import OrderManagement from './OrderManagement';
import { menuItems } from '@/data/menuData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'stats' | 'menu'>('orders');
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  useEffect(() => {
    // Check if admin is logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn || adminLoggedIn !== 'true') {
      navigate('/admin/login');
      return;
    }
    
    setIsAdmin(true);
    
    // Get orders data
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrdersCount(orders.length);
    
    // Calculate total revenue
    const revenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
    setTotalRevenue(revenue);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
  };

  if (!isAdmin) {
    return null; // Don't render anything while checking auth
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MenuIcon className="mr-2 text-kebab-primary" size={24} />
              <h1 className="text-xl font-bold text-kebab-primary">Kebab Express Admin</h1>
            </div>
            
            <Button
              variant="ghost"
              className="text-gray-500 hover:text-red-500"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-2" />
              Odhlásiť sa
            </Button>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Celkový počet objednávok</h2>
            <p className="text-3xl font-bold text-kebab-primary">{ordersCount}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Tržby celkom</h2>
            <p className="text-3xl font-bold text-kebab-primary">{totalRevenue.toFixed(2)} €</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Položky v menu</h2>
            <p className="text-3xl font-bold text-kebab-primary">{menuItems.length}</p>
          </div>
        </div>
        
        {/* Admin Tabs */}
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
              Objednávky
            </button>
            
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'stats'
                  ? 'text-kebab-primary border-b-2 border-kebab-primary'
                  : 'text-gray-500 hover:text-kebab-primary'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Štatistiky
            </button>
            
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'menu'
                  ? 'text-kebab-primary border-b-2 border-kebab-primary'
                  : 'text-gray-500 hover:text-kebab-primary'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'orders' && <OrderManagement />}
        
        {activeTab === 'stats' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Štatistiky</h2>
            <p className="text-gray-500">Táto funkcia bude implementovaná v budúcej verzii.</p>
          </div>
        )}
        
        {activeTab === 'menu' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Správa menu</h2>
            <p className="text-gray-500 mb-6">Táto funkcia bude implementovaná v budúcej verzii.</p>
            
            <h3 className="font-bold text-gray-700 mb-2">Aktuálne položky v menu</h3>
            <div className="divide-y">
              {menuItems.map(item => (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <p className="font-bold">{item.price.toFixed(2)} €</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

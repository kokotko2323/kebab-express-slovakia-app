
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu as MenuIcon, Settings, Users, ShoppingBag, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import RestaurantSettings from './RestaurantSettings';

type TabType = 'orders' | 'users' | 'settings';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [ordersCount, setOrdersCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdmin = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user) {
        navigate('/admin/login');
        return;
      }
      
      const isAdmin = data.session.user.app_metadata?.isAdmin === true || 
                     data.session.user.user_metadata?.isAdmin === true;
      
      if (!isAdmin) {
        toast.error('Prístup zamietnutý. Nemáte oprávnenie pre túto stránku.');
        navigate('/admin/login');
        return;
      }
      
      setIsAdmin(true);
      fetchDashboardData();
    };
    
    checkAdmin();
  }, [navigate]);
  
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get orders data
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*');
      
      if (orderError) throw orderError;
      
      setOrdersCount(orders?.length || 0);
      
      // Calculate pending orders
      const pending = orders?.filter(order => 
        ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(order.status)
      ).length || 0;
      setPendingOrders(pending);
      
      // Calculate total revenue
      const revenue = orders?.reduce((sum, order) => 
        order.status !== 'CANCELLED' ? sum + parseFloat(order.total_amount) : sum, 0
      ) || 0;
      setTotalRevenue(revenue);
      
      // Get users count
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (userError) throw userError;
      
      setUsersCount(userCount || 0);
      
      // Get restaurant status
      const { data: settings, error: settingsError } = await supabase
        .from('restaurant_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      if (settings) {
        setIsRestaurantOpen(settings.is_open);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Nastala chyba pri načítavaní dát');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('Boli ste odhlásení.');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Nastala chyba pri odhlásení');
    }
  };
  
  const toggleRestaurantStatus = async () => {
    try {
      // Get current settings
      const { data: settings, error: getError } = await supabase
        .from('restaurant_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (getError && getError.code !== 'PGRST116') throw getError;
      
      if (settings) {
        // Update existing settings
        const { error: updateError } = await supabase
          .from('restaurant_settings')
          .update({ is_open: !settings.is_open })
          .eq('id', settings.id);
        
        if (updateError) throw updateError;
        
        setIsRestaurantOpen(!settings.is_open);
        toast.success(!settings.is_open 
          ? 'Reštaurácia bola otvorená' 
          : 'Reštaurácia bola zatvorená');
      } else {
        // Create new settings
        const { error: insertError } = await supabase
          .from('restaurant_settings')
          .insert({ is_open: false });
        
        if (insertError) throw insertError;
        
        setIsRestaurantOpen(false);
        toast.success('Reštaurácia bola zatvorená');
      }
    } catch (error) {
      console.error('Error toggling restaurant status:', error);
      toast.error('Nastala chyba pri aktualizácii stavu reštaurácie');
    }
  };

  if (!isAdmin || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Načítavam...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <MenuIcon className="mr-2 text-kebab-primary" size={24} />
              <h1 className="text-xl font-bold text-kebab-primary">Kebab Express Admin</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                isRestaurantOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-1 ${
                  isRestaurantOpen ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {isRestaurantOpen ? 'Otvorené' : 'Zatvorené'}
              </div>
              
              <Button
                variant="outline"
                className={isRestaurantOpen ? 'text-red-500 border-red-200' : 'text-green-500 border-green-200'}
                size="sm"
                onClick={toggleRestaurantStatus}
              >
                {isRestaurantOpen ? 'Zatvoriť reštauráciu' : 'Otvoriť reštauráciu'}
              </Button>
              
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
        </div>
      </header>
      
      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Stats */}
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
        
        {/* Admin Tabs */}
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
        
        {/* Tab Content */}
        {activeTab === 'orders' && <OrderManagement onOrderUpdate={fetchDashboardData} />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'settings' && <RestaurantSettings />}
      </main>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { User, LogOut, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Registration/login form state
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // For profile updates
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [pastOrders, setPastOrders] = useState([]);
  
  React.useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchOrders();
    }
  }, [user]);
  
  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      // Set from user metadata
      const userData = user.user_metadata;
      if (userData) {
        setName(userData.name || '');
        setPhone(userData.phone || '');
        setAddress(userData.address || '');
      }
      setEmail(user.email || '');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setOrdersLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPastOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Nepodarilo sa načítať objednávky');
    } finally {
      setOrdersLoading(false);
    }
  };
  
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name || !email || !password || !phone) {
          toast.error('Vyplňte prosím všetky povinné polia');
          return;
        }
        await signUp(email, password, name, phone);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        data: {
          name,
          phone,
          address
        }
      });
      
      if (error) throw error;
      
      toast.success('Profil bol aktualizovaný!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Nastala chyba pri aktualizácii profilu');
    } finally {
      setIsLoading(false);
    }
  };

  // View an order details
  const viewOrderDetails = (order: any) => {
    // Store the order details in localStorage for the order status page
    localStorage.setItem('currentOrder', JSON.stringify(order));
    navigate('/order-status');
  };

  return (
    <MobileLayout>
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      
      {!user ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {isLogin ? 'Prihlásenie' : 'Registrácia'}
            </h2>
            <Button 
              variant="ghost" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-kebab-primary hover:text-kebab-primary/90"
            >
              {isLogin ? 'Vytvoriť účet' : 'Prihlásiť sa'}
            </Button>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Meno a priezvisko*
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Heslo*
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefónne číslo*
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    required={!isLogin}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresa
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                  />
                </div>
              </>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-kebab-primary hover:bg-kebab-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Spracúva sa...' : isLogin ? 'Prihlásiť sa' : 'Registrovať sa'}
            </Button>
          </form>
          
          {!isLogin && (
            <p className="text-sm text-gray-500 mt-4">
              Registráciou súhlasíte s našimi podmienkami používania a ochranou osobných údajov. Po registrácii vám bude zaslaný potvrdzovací email.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-kebab-primary text-white flex items-center justify-center">
                  <User size={24} />
                </div>
                <div className="ml-3">
                  <h2 className="font-bold text-lg">{name || user.email}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              >
                <LogOut size={20} />
              </Button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4 mt-6">
              <div>
                <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Meno a priezvisko
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefónne číslo
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="profile-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresa
                </label>
                <input
                  id="profile-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-kebab-primary hover:bg-kebab-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Aktualizuje sa...' : 'Aktualizovať profil'}
              </Button>
            </form>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <ShoppingBag className="mr-2 text-kebab-primary" size={20} />
              <h2 className="text-lg font-bold">História objednávok</h2>
            </div>
            
            {ordersLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Načítavanie objednávok...</p>
              </div>
            ) : pastOrders.length > 0 ? (
              <div className="space-y-4">
                {pastOrders.map((order: any) => (
                  <div 
                    key={order.id} 
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-kebab-primary"
                    onClick={() => viewOrderDetails(order)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Objednávka #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{order.total_amount.toFixed(2)} €</span>
                        <div className={`mt-1 py-1 px-2 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {order.items.slice(0, 2).map((item: any, index: number) => (
                        <span key={index} className="block truncate">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-gray-500">
                          +{order.items.length - 2} ďalšie
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center">
                <ShoppingBag className="mx-auto text-gray-400 mb-2" size={40} />
                <h2 className="text-lg font-semibold mb-1">Žiadne objednávky</h2>
                <p className="text-gray-500 text-sm mb-4">Zatiaľ nemáte žiadne objednávky</p>
                <Link to="/menu">
                  <Button className="bg-kebab-primary hover:bg-kebab-primary/90">
                    Prejsť do menu
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </MobileLayout>
  );
};

// Helper functions
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Čaká sa';
    case 'CONFIRMED':
      return 'Potvrdené';
    case 'PREPARING':
      return 'Príprava';
    case 'READY':
      return 'Pripravené';
    case 'DELIVERING':
      return 'Doručuje sa';
    case 'DELIVERED':
      return 'Doručené';
    case 'COMPLETED':
      return 'Dokončené';
    case 'CANCELLED':
      return 'Zrušené';
    default:
      return status;
  }
};

const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'PREPARING':
      return 'bg-purple-100 text-purple-800';
    case 'READY':
      return 'bg-indigo-100 text-indigo-800';
    case 'DELIVERING':
      return 'bg-orange-100 text-orange-800';
    case 'DELIVERED':
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default Profile;

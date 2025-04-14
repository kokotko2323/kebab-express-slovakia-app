
import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { OrderDetails } from '@/types';
import { Link } from 'react-router-dom';
import { Clock, User, LogOut, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pastOrders, setPastOrders] = useState<OrderDetails[]>([]);
  
  useEffect(() => {
    // Check if user is logged in (mock)
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setIsLoggedIn(true);
      setName(parsedUser.name || '');
      setEmail(parsedUser.email || '');
      setPhone(parsedUser.phone || '');
      setAddress(parsedUser.address || '');
    }
    
    // Get past orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    setPastOrders(orders);
  }, []);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error('Prosím, vyplňte povinné polia.');
      return;
    }
    
    // Store user info in localStorage (in a real app, this would be an API call)
    const userInfo = { name, email, phone, address };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    setIsLoggedIn(true);
    toast.success('Prihlásenie úspešné!');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    toast.info('Boli ste odhlásení.');
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user info in localStorage
    const userInfo = { name, email, phone, address };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    toast.success('Profil bol aktualizovaný!');
  };

  return (
    <MobileLayout>
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      
      {!isLoggedIn ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Prihlásenie / Registrácia</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
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
                required
              />
            </div>
            
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefónne číslo
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
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
            
            <Button type="submit" className="w-full bg-kebab-primary hover:bg-kebab-primary/90">
              Prihlásiť sa
            </Button>
          </form>
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
                  <h2 className="font-bold text-lg">{name}</h2>
                  <p className="text-sm text-gray-500">{email}</p>
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
              
              <Button type="submit" className="w-full bg-kebab-primary hover:bg-kebab-primary/90">
                Aktualizovať profil
              </Button>
            </form>
          </div>
          
          {pastOrders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <ShoppingBag className="mr-2 text-kebab-primary" size={20} />
                <h2 className="text-lg font-bold">História objednávok</h2>
              </div>
              
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-gray-200 rounded-lg p-4"
                    onClick={() => {
                      localStorage.setItem('currentOrder', JSON.stringify(order));
                    }}
                  >
                    <Link to="/order-status">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Objednávka #{order.id}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{order.totalAmount.toFixed(2)} €</span>
                          <div className={`mt-1 py-1 px-2 rounded-full text-xs ${
                            order.status === 'COMPLETED' || order.status === 'DELIVERED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status === 'PENDING' ? 'Čaká sa' :
                             order.status === 'CONFIRMED' ? 'Potvrdené' :
                             order.status === 'PREPARING' ? 'Príprava' :
                             order.status === 'READY' ? 'Pripravené' :
                             order.status === 'DELIVERING' ? 'Doručuje sa' :
                             order.status === 'DELIVERED' ? 'Doručené' :
                             order.status === 'COMPLETED' ? 'Dokončené' : 'Zrušené'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600">
                        {order.items.slice(0, 2).map((item, index) => (
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
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
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
        </>
      )}
    </MobileLayout>
  );
};

export default Profile;

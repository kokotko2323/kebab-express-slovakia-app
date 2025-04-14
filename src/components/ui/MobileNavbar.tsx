
import { Link, useLocation } from 'react-router-dom';
import { Home, Menu, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../cart/CartProvider';

const MobileNavbar = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 max-w-md mx-auto">
      <div className="flex items-center justify-around py-2">
        <NavItem 
          to="/" 
          icon={<Home size={24} />} 
          label="Domov"
          isActive={isActive('/')}
        />
        <NavItem 
          to="/menu" 
          icon={<Menu size={24} />} 
          label="Menu"
          isActive={isActive('/menu')}
        />
        <NavItem 
          to="/cart" 
          icon={
            <div className="relative">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-kebab-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
          } 
          label="Košík"
          isActive={isActive('/cart')}
        />
        <NavItem 
          to="/profile" 
          icon={<User size={24} />} 
          label="Profil"
          isActive={isActive('/profile')}
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center w-20 py-1 transition-colors ${
        isActive ? 'text-kebab-primary' : 'text-gray-500'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default MobileNavbar;

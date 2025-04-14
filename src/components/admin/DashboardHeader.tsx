
import React from 'react';
import { LogOut, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RestaurantStatusToggle from './RestaurantStatusToggle';

interface DashboardHeaderProps {
  isRestaurantOpen: boolean;
  toggleRestaurantStatus: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isRestaurantOpen,
  toggleRestaurantStatus,
  handleLogout
}) => {
  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MenuIcon className="mr-2 text-kebab-primary" size={24} />
            <h1 className="text-xl font-bold text-kebab-primary">Kebab Express Admin</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <RestaurantStatusToggle 
              isOpen={isRestaurantOpen} 
              onToggle={toggleRestaurantStatus} 
            />
            
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
  );
};

export default DashboardHeader;

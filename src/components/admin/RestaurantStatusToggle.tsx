
import React from 'react';
import { Button } from '@/components/ui/button';

interface RestaurantStatusToggleProps {
  isOpen: boolean;
  onToggle: () => Promise<void>;
}

const RestaurantStatusToggle: React.FC<RestaurantStatusToggleProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
        isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <span className={`w-2 h-2 rounded-full mr-1 ${
          isOpen ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
        {isOpen ? 'Otvorené' : 'Zatvorené'}
      </div>
      
      <Button
        variant="outline"
        className={isOpen ? 'text-red-500 border-red-200' : 'text-green-500 border-green-200'}
        size="sm"
        onClick={onToggle}
      >
        {isOpen ? 'Zatvoriť reštauráciu' : 'Otvoriť reštauráciu'}
      </Button>
    </div>
  );
};

export default RestaurantStatusToggle;

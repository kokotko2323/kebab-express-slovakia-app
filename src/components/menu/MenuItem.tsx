
import React from 'react';
import { MenuItem as MenuItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '../cart/CartProvider';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();
  
  return (
    <div className="menu-item animate-fade-in">
      <div className="relative">
        <img 
          src={item.image || '/placeholder.svg'} 
          alt={item.name} 
          className="menu-item-image"
        />
        <div className="absolute top-2 right-2 bg-kebab-primary text-white py-1 px-2 rounded-md font-bold">
          {item.price.toFixed(2)} €
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg">{item.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
        
        <div className="flex items-center text-xs text-gray-500 mt-2 space-x-4">
          <span>{item.weight}</span>
          {item.allergens && <span>Obsahuje: {item.allergens}</span>}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Button 
            onClick={() => addItem(item)}
            className="bg-kebab-primary text-white hover:bg-kebab-primary/90 flex items-center"
          >
            <ShoppingCart className="mr-1" size={16} />
            Pridať
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;

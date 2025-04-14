
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import MenuList from '@/components/menu/MenuList';
import { useCart } from '@/components/cart/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const { totalItems, totalPrice } = useCart();
  
  return (
    <MobileLayout>
      <h1 className="text-2xl font-bold mb-6">Menu</h1>
      
      <MenuList />
      
      {/* Cart floating button */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-4 z-40 max-w-md mx-auto">
          <Link to="/cart">
            <Button className="w-full bg-kebab-primary hover:bg-kebab-primary/90 shadow-lg flex items-center justify-between py-6">
              <div className="flex items-center">
                <ShoppingCart className="mr-2" />
                <span>{totalItems} položiek</span>
              </div>
              <span className="font-bold">{totalPrice.toFixed(2)} €</span>
            </Button>
          </Link>
        </div>
      )}
    </MobileLayout>
  );
};

export default Menu;


import React from 'react';
import { useCart } from './CartProvider';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const { items, removeItem, updateQuantity, totalPrice, hasPromotion, promotionDiscount } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-8xl mb-4">🍽️</div>
        <h2 className="text-2xl font-bold mb-2">Váš košík je prázdny</h2>
        <p className="text-gray-500 mb-6">Pridajte položky do košíka</p>
        <Link to="/menu">
          <Button className="bg-kebab-primary hover:bg-kebab-primary/90">
            Prejsť do menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="section-title">Váš košík</h2>

      <div className="space-y-4">
        {items.map(item => (
          <div 
            key={item.id} 
            className="bg-white rounded-lg shadow p-4 flex items-center"
          >
            {item.image && (
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
            )}
            
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.price.toFixed(2)} €</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus size={16} />
              </Button>
              
              <span className="w-6 text-center">{item.quantity}</span>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={16} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Promotions */}
      {hasPromotion && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-green-800">Akcia aplikovaná!</h3>
              <p className="text-sm text-green-700">Zľava za nákup 2+ Coca-Cola</p>
            </div>
            <span className="font-bold text-green-700">-{promotionDiscount.toFixed(2)} €</span>
          </div>
        </div>
      )}
      
      {/* Total */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Celková suma:</span>
          <span className="font-bold text-xl text-kebab-primary">{totalPrice.toFixed(2)} €</span>
        </div>
        
        <Link to="/checkout" className="block mt-4">
          <Button className="w-full bg-kebab-primary hover:bg-kebab-primary/90">
            Pokračovať k objednávke
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;

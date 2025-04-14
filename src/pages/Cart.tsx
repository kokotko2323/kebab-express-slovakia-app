
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import CartSummary from '@/components/cart/CartSummary';

const Cart = () => {
  return (
    <MobileLayout>
      <h1 className="text-2xl font-bold mb-6">Košík</h1>
      
      <CartSummary />
    </MobileLayout>
  );
};

export default Cart;

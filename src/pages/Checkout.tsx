
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import CheckoutForm from '@/components/checkout/CheckoutForm';

const Checkout = () => {
  return (
    <MobileLayout>
      <h1 className="text-2xl font-bold mb-6">Dokončiť objednávku</h1>
      
      <CheckoutForm />
    </MobileLayout>
  );
};

export default Checkout;

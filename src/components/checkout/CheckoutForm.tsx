
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/cart/CartProvider';
import { useNavigate } from 'react-router-dom';
import { DeliveryMethod, PaymentMethod } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useRestaurantStatus } from '@/hooks/useRestaurantStatus';

const CheckoutForm = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { isOpen } = useRestaurantStatus();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validate cart is not empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Váš košík je prázdny');
      navigate('/menu');
    }
  }, [items, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOpen) {
      toast.error('Reštaurácia je momentálne zatvorená. Objednávku nie je možné dokončiť.');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Váš košík je prázdny');
      return;
    }
    
    if (!name || !phone || (deliveryMethod === 'DELIVERY' && !address)) {
      toast.error('Vyplňte prosím všetky povinné údaje');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Parse items to string if they're objects to fix any potential issues
      const serializedItems = JSON.stringify(items);
      
      // Create order object
      const order = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_address: deliveryMethod === 'DELIVERY' ? address : null,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        total_amount: totalPrice,
        items: serializedItems,
        status: 'PENDING',
        user_id: null // No user authentication, just place order directly
      };
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();
      
      if (error) throw error;
      
      // Save current order to localStorage for order status page
      localStorage.setItem('currentOrder', JSON.stringify(data));
      
      // Success! Clear cart and redirect
      clearCart();
      toast.success('Objednávka bola úspešne odoslaná!');
      navigate('/order-status');
      
    } catch (error: any) {
      console.error('Error submitting order:', error);
      toast.error('Nastala chyba pri odosielaní objednávky');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Kontaktné údaje</h2>
          
          <div className="space-y-4">
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
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            
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
                required
              />
            </div>
          </div>
        </div>
        
        {/* Delivery Method */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Spôsob doručenia</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex-1 border rounded-lg p-3 cursor-pointer ${
                  deliveryMethod === 'DELIVERY'
                    ? 'border-kebab-primary bg-kebab-primary/5'
                    : 'border-gray-200'
                }`}
                onClick={() => setDeliveryMethod('DELIVERY')}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      deliveryMethod === 'DELIVERY'
                        ? 'border-kebab-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {deliveryMethod === 'DELIVERY' && (
                      <div className="w-3 h-3 rounded-full bg-kebab-primary"></div>
                    )}
                  </div>
                  <span className="font-medium">Doručenie</span>
                </div>
              </div>
              
              <div
                className={`flex-1 border rounded-lg p-3 cursor-pointer ${
                  deliveryMethod === 'PICKUP'
                    ? 'border-kebab-primary bg-kebab-primary/5'
                    : 'border-gray-200'
                }`}
                onClick={() => setDeliveryMethod('PICKUP')}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      deliveryMethod === 'PICKUP'
                        ? 'border-kebab-primary'
                        : 'border-gray-300'
                    }`}
                  >
                    {deliveryMethod === 'PICKUP' && (
                      <div className="w-3 h-3 rounded-full bg-kebab-primary"></div>
                    )}
                  </div>
                  <span className="font-medium">Osobný odber</span>
                </div>
              </div>
            </div>
            
            {deliveryMethod === 'DELIVERY' && (
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresa doručenia*
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field"
                  required={deliveryMethod === 'DELIVERY'}
                  placeholder="Ulica, číslo, mesto, PSČ"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Spôsob platby</h2>
          
          <div className="space-y-3">
            <div
              className={`border rounded-lg p-3 cursor-pointer ${
                paymentMethod === 'CASH'
                  ? 'border-kebab-primary bg-kebab-primary/5'
                  : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('CASH')}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'CASH'
                      ? 'border-kebab-primary'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'CASH' && (
                    <div className="w-3 h-3 rounded-full bg-kebab-primary"></div>
                  )}
                </div>
                <span className="font-medium">Hotovosť pri prevzatí</span>
              </div>
            </div>
            
            <div
              className={`border rounded-lg p-3 cursor-pointer ${
                paymentMethod === 'CARD'
                  ? 'border-kebab-primary bg-kebab-primary/5'
                  : 'border-gray-200'
              }`}
              onClick={() => setPaymentMethod('CARD')}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'CARD'
                      ? 'border-kebab-primary'
                      : 'border-gray-300'
                  }`}
                >
                  {paymentMethod === 'CARD' && (
                    <div className="w-3 h-3 rounded-full bg-kebab-primary"></div>
                  )}
                </div>
                <span className="font-medium">Kartou pri prevzatí</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Zhrnutie objednávky</h2>
          
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">
                  {(item.price * item.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Celková suma:</span>
            <span>{totalPrice.toFixed(2)} €</span>
          </div>
        </div>
        
        {/* Submit Order */}
        <Button
          type="submit"
          className="w-full py-6 text-lg bg-kebab-primary hover:bg-kebab-primary/90"
          disabled={isSubmitting || !isOpen}
        >
          {isSubmitting ? 'Spracúva sa...' : !isOpen ? 'Reštaurácia je zatvorená' : 'Dokončiť objednávku'}
        </Button>
        
        {!isOpen && (
          <p className="text-center text-red-500 text-sm">
            Reštaurácia je momentálne zatvorená. Skúste to neskôr.
          </p>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;


import React, { useState } from 'react';
import { useCart } from '../cart/CartProvider';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DeliveryMethod, OrderDetails, PaymentMethod } from '@/types';
import { restaurantInfo } from '@/data/menuData';

const CheckoutForm = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !phone) {
      toast.error('Prosím, vyplňte povinné polia.');
      return;
    }
    
    if (deliveryMethod === 'DELIVERY' && !address) {
      toast.error('Prosím, vyplňte adresu doručenia.');
      return;
    }
    
    setIsLoading(true);
    
    // Mock API call to create order
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderDetails: OrderDetails = {
        id: `ORDER-${Math.floor(Math.random() * 1000000)}`,
        items: [...items],
        totalAmount: totalPrice,
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        deliveryAddress: address,
        deliveryMethod,
        paymentMethod,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      // Store order in localStorage (in a real app, this would be stored in a database)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(orderDetails);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
      
      clearCart();
      toast.success('Objednávka úspešne odoslaná!');
      navigate('/order-status');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Nastala chyba pri vytváraní objednávky.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="section-title">Kontaktné údaje</h2>
        
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
        </div>
      </div>
      
      <div>
        <h2 className="section-title">Spôsob doručenia</h2>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              type="button"
              className={`flex-1 ${
                deliveryMethod === 'DELIVERY'
                  ? 'bg-kebab-primary hover:bg-kebab-primary/90'
                  : 'bg-white text-kebab-dark border border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setDeliveryMethod('DELIVERY')}
            >
              Doručenie
            </Button>
            
            <Button
              type="button"
              className={`flex-1 ${
                deliveryMethod === 'PICKUP'
                  ? 'bg-kebab-primary hover:bg-kebab-primary/90'
                  : 'bg-white text-kebab-dark border border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setDeliveryMethod('PICKUP')}
            >
              Osobný odber
            </Button>
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
                required
              />
            </div>
          )}
          
          {deliveryMethod === 'PICKUP' && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">Adresa prevádzky:</p>
              <p className="text-sm">{restaurantInfo.address}</p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="section-title">Spôsob platby</h2>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              type="button"
              className={`flex-1 ${
                paymentMethod === 'CASH'
                  ? 'bg-kebab-primary hover:bg-kebab-primary/90'
                  : 'bg-white text-kebab-dark border border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setPaymentMethod('CASH')}
            >
              Hotovosť
            </Button>
            
            <Button
              type="button"
              className={`flex-1 ${
                paymentMethod === 'CARD'
                  ? 'bg-kebab-primary hover:bg-kebab-primary/90'
                  : 'bg-white text-kebab-dark border border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setPaymentMethod('CARD')}
            >
              Kartou pri doručení
            </Button>
          </div>
          
          <Button
            type="button"
            className={`w-full ${
              paymentMethod === 'ONLINE'
                ? 'bg-kebab-primary hover:bg-kebab-primary/90'
                : 'bg-white text-kebab-dark border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => setPaymentMethod('ONLINE')}
          >
            Online platba
          </Button>
        </div>
      </div>
      
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Poznámka k objednávke
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-field min-h-[100px]"
          placeholder="Špecifické požiadavky, napr. bez cibule..."
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">Celková suma:</span>
          <span className="font-bold text-xl text-kebab-primary">{totalPrice.toFixed(2)} €</span>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-kebab-primary hover:bg-kebab-primary/90"
          disabled={isLoading}
        >
          {isLoading ? 'Spracovanie...' : 'Dokončiť objednávku'}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;

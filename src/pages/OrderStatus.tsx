
import React, { useEffect, useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { CheckCircle, Clock, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { OrderDetails, OrderStatus as OrderStatusType } from '@/types';

const OrderStatus = () => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatusType>('PENDING');

  useEffect(() => {
    // Load the current order from localStorage
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
    
    // Simulate order status updates
    const timer = setTimeout(() => {
      setOrderStatus('CONFIRMED');
      
      setTimeout(() => {
        setOrderStatus('PREPARING');
        
        setTimeout(() => {
          setOrderStatus('READY');
          
          if (order?.deliveryMethod === 'DELIVERY') {
            setTimeout(() => {
              setOrderStatus('DELIVERING');
              
              setTimeout(() => {
                setOrderStatus('DELIVERED');
              }, 20000);
            }, 10000);
          } else {
            setTimeout(() => {
              setOrderStatus('COMPLETED');
            }, 10000);
          }
        }, 15000);
      }, 10000);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [order?.deliveryMethod]);

  // Update the order status in localStorage
  useEffect(() => {
    if (order) {
      const updatedOrder = { ...order, status: orderStatus };
      localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
      setOrder(updatedOrder);
      
      // Update the order in orders list
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map((o: OrderDetails) => 
        o.id === order.id ? { ...o, status: orderStatus } : o
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
    }
  }, [orderStatus]);

  if (!order) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-xl font-bold mb-4">Žiadna aktívna objednávka</h2>
          <Link to="/menu">
            <Button className="bg-kebab-primary hover:bg-kebab-primary/90">
              Prejsť do menu
            </Button>
          </Link>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="bg-white rounded-lg shadow-lg p-6 -mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Vaša objednávka</h1>
          <p className="text-gray-500">Objednávka #{order.id}</p>
        </div>
        
        {/* Order status indicators */}
        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Status steps */}
          <div className="space-y-6 relative">
            <StatusStep 
              icon={<CheckCircle size={24} />} 
              title="Objednávka prijatá" 
              description="Vaša objednávka bola úspešne prijatá"
              active={true}
              completed={true}
            />
            
            <StatusStep 
              icon={<Clock size={24} />} 
              title="Objednávka potvrdená" 
              description="Reštaurácia potvrdila vašu objednávku"
              active={['CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(orderStatus)}
              completed={['CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(orderStatus)}
            />
            
            <StatusStep 
              icon={<Package size={24} />} 
              title="Príprava objednávky" 
              description="Vaša objednávka sa práve pripravuje"
              active={['PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(orderStatus)}
              completed={['READY', 'DELIVERING', 'DELIVERED', 'COMPLETED'].includes(orderStatus)}
            />
            
            {order.deliveryMethod === 'DELIVERY' ? (
              <>
                <StatusStep 
                  icon={<Truck size={24} />} 
                  title="Na ceste" 
                  description="Vaša objednávka je na ceste k vám"
                  active={['DELIVERING', 'DELIVERED', 'COMPLETED'].includes(orderStatus)}
                  completed={['DELIVERED', 'COMPLETED'].includes(orderStatus)}
                />
                
                <StatusStep 
                  icon={<CheckCircle size={24} />} 
                  title="Doručené" 
                  description="Vaša objednávka bola úspešne doručená"
                  active={['DELIVERED', 'COMPLETED'].includes(orderStatus)}
                  completed={['COMPLETED'].includes(orderStatus)}
                />
              </>
            ) : (
              <StatusStep 
                icon={<CheckCircle size={24} />} 
                title="Pripravené na vyzdvihnutie" 
                description="Vaša objednávka je pripravená na vyzdvihnutie"
                active={['READY', 'COMPLETED'].includes(orderStatus)}
                completed={['COMPLETED'].includes(orderStatus)}
              />
            )}
          </div>
        </div>
        
        {/* Order summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="font-bold text-lg mb-4">Zhrnutie objednávky</h2>
          
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span>{(item.price * item.quantity).toFixed(2)} €</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-bold">
            <span>Celkom</span>
            <span>{order.totalAmount.toFixed(2)} €</span>
          </div>
        </div>
        
        {/* Order details */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="font-bold text-lg mb-4">Detaily objednávky</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Spôsob doručenia:</span>
              <span>{order.deliveryMethod === 'DELIVERY' ? 'Doručenie' : 'Osobný odber'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Spôsob platby:</span>
              <span>
                {order.paymentMethod === 'CASH' ? 'Hotovosť' : 
                 order.paymentMethod === 'CARD' ? 'Kartou pri doručení' : 'Online platba'}
              </span>
            </div>
            
            {order.deliveryAddress && (
              <div className="flex justify-between">
                <span className="text-gray-500">Adresa:</span>
                <span className="text-right">{order.deliveryAddress}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <Link to="/menu">
            <Button className="w-full bg-kebab-primary hover:bg-kebab-primary/90">
              Objednať ďalšie
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
};

interface StatusStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  completed: boolean;
}

const StatusStep: React.FC<StatusStepProps> = ({ icon, title, description, active, completed }) => {
  return (
    <div className="flex">
      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${
        completed ? 'bg-green-500 text-white' : 
        active ? 'bg-kebab-primary text-white' : 
        'bg-gray-200 text-gray-500'
      }`}>
        {icon}
      </div>
      
      <div className="ml-4">
        <h3 className={`font-medium ${active ? 'text-gray-900' : 'text-gray-500'}`}>{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default OrderStatus;

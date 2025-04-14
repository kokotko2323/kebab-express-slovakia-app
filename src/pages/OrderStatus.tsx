
import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, Home, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const OrderStatus = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get order from localStorage
    const storedOrder = localStorage.getItem('currentOrder');
    if (!storedOrder) {
      navigate('/menu');
      return;
    }
    
    const parsedOrder = JSON.parse(storedOrder);
    setOrder(parsedOrder);
    setLoading(false);
    
    // Set up real-time listener for this order
    if (parsedOrder?.id) {
      const channel = supabase
        .channel('order_updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `id=eq.${parsedOrder.id}`
          },
          (payload) => {
            console.log('Order update received:', payload);
            const newOrder = payload.new;
            setOrder((prev: any) => ({ ...prev, ...newOrder }));
            
            // Show toast notification for status change
            if (newOrder.status !== parsedOrder.status) {
              const newStatus = getStatusLabel(newOrder.status);
              const notification = new Notification('Kebab Express', {
                body: `Stav vašej objednávky sa zmenil na: ${newStatus}`,
                icon: '/favicon.ico'
              });
            }
            
            // Update localStorage
            localStorage.setItem('currentOrder', JSON.stringify({ ...parsedOrder, ...newOrder }));
          }
        )
        .subscribe();
        
      // Request notification permission
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [navigate]);
  
  if (loading) {
    return (
      <MobileLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Načítavam objednávku...</p>
        </div>
      </MobileLayout>
    );
  }
  
  if (!order) {
    return (
      <MobileLayout>
        <div className="text-center py-10">
          <ShoppingBag className="mx-auto text-gray-400 mb-4" size={60} />
          <h2 className="text-xl font-bold mb-2">Žiadna objednávka</h2>
          <p className="text-gray-500 mb-6">Nemáte žiadnu aktívnu objednávku</p>
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
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sledovanie objednávky</h1>
          <p className="text-sm text-gray-500 mt-1">Objednávka #{order.id.substring(0, 8)}</p>
        </div>
        
        {/* Status display */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-semibold mb-4">Stav objednávky</h2>
          
          {order.status === 'CANCELLED' ? (
            <div className="text-center py-4 text-red-500">
              <p className="font-bold text-lg">Objednávka bola zrušená</p>
              <p className="text-sm mt-2">Ľutujeme, vaša objednávka bola zrušená.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Progress bar */}
              <div className="absolute top-0 left-0 w-full flex justify-between z-10 px-3">
                {['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED'].map((status, index) => (
                  <div 
                    key={status}
                    className={`w-4 h-4 rounded-full ${
                      getStatusIndex(order.status) >= index 
                        ? 'bg-kebab-primary' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              
              {/* Progress bar line */}
              <div className="h-1 bg-gray-200 absolute top-1.5 left-5 right-5 z-0">
                <div 
                  className="h-1 bg-kebab-primary transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, getStatusIndex(order.status) * 20)}%` 
                  }}
                />
              </div>
              
              {/* Status labels */}
              <div className="grid grid-cols-3 pt-8 gap-4 text-center text-sm">
                <div className={getStatusIndex(order.status) >= 0 ? 'text-kebab-primary font-medium' : 'text-gray-400'}>
                  <Package className="mx-auto mb-1" size={20} />
                  Prijatá
                </div>
                
                <div className={getStatusIndex(order.status) >= 2 ? 'text-kebab-primary font-medium' : 'text-gray-400'}>
                  <Clock className="mx-auto mb-1" size={20} />
                  Príprava
                </div>
                
                {order.delivery_method === 'DELIVERY' ? (
                  <div className={getStatusIndex(order.status) >= 4 ? 'text-kebab-primary font-medium' : 'text-gray-400'}>
                    <Truck className="mx-auto mb-1" size={20} />
                    Doručovanie
                  </div>
                ) : (
                  <div className={getStatusIndex(order.status) >= 4 ? 'text-kebab-primary font-medium' : 'text-gray-400'}>
                    <Home className="mx-auto mb-1" size={20} />
                    Pripravené
                  </div>
                )}
              </div>
              
              {/* Current status */}
              <div className="mt-6 text-center">
                <p className="font-medium text-lg">{getStatusLabel(order.status)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {getStatusMessage(order.status, order.delivery_method)}
                </p>
                
                {order.status === 'COMPLETED' && (
                  <div className="mt-4 flex items-center justify-center text-green-600">
                    <CheckCircle className="mr-2" size={20} />
                    <span>Objednávka dokončená</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Order details */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="font-semibold mb-2">Detaily objednávky</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vytvorená:</span>
              <span>{new Date(order.created_at).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Spôsob doručenia:</span>
              <span>{order.delivery_method === 'DELIVERY' ? 'Doručenie' : 'Osobný odber'}</span>
            </div>
            
            {order.delivery_method === 'DELIVERY' && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Adresa:</span>
                <span className="text-right">{order.delivery_address}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platba:</span>
              <span>
                {order.payment_method === 'CASH' ? 'Hotovosť pri prevzatí' : 
                 order.payment_method === 'CARD' ? 'Kartou pri prevzatí' : 'Online platba'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Order items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="font-semibold mb-4">Objednané položky</h2>
          
          <div className="space-y-3">
            {Array.isArray(order.items) ? (
              order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-sm text-gray-500">Množstvo: {item.quantity}</p>
                  </div>
                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Položky nie sú k dispozícii</p>
            )}
            
            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold">
              <span>Celková suma:</span>
              <span>{order.total_amount.toFixed(2)} €</span>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link to="/menu">
            <Button variant="outline" className="mr-2">
              Prejsť do menu
            </Button>
          </Link>
          
          <Link to="/profile">
            <Button className="bg-kebab-primary hover:bg-kebab-primary/90">
              Zobraziť profil
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
};

// Helper functions
const getStatusIndex = (status: string): number => {
  const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED'];
  return statuses.indexOf(status);
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Čakajúca objednávka';
    case 'CONFIRMED':
      return 'Objednávka potvrdená';
    case 'PREPARING':
      return 'Príprava objednávky';
    case 'READY':
      return 'Objednávka pripravená';
    case 'DELIVERING':
      return 'Doručovanie';
    case 'DELIVERED':
    case 'COMPLETED':
      return 'Objednávka dokončená';
    case 'CANCELLED':
      return 'Objednávka zrušená';
    default:
      return 'Neznámy stav';
  }
};

const getStatusMessage = (status: string, deliveryMethod: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Vaša objednávka bola prijatá a čaká na potvrdenie.';
    case 'CONFIRMED':
      return 'Vaša objednávka bola potvrdená a čoskoro začneme s prípravou.';
    case 'PREPARING':
      return 'Práve pripravujeme vašu objednávku.';
    case 'READY':
      return deliveryMethod === 'DELIVERY' 
        ? 'Vaša objednávka je pripravená na doručenie.'
        : 'Vaša objednávka je pripravená na vyzdvihnutie.';
    case 'DELIVERING':
      return 'Vaša objednávka je na ceste k vám.';
    case 'DELIVERED':
    case 'COMPLETED':
      return 'Vaša objednávka bola úspešne dokončená.';
    default:
      return '';
  }
};

export default OrderStatus;

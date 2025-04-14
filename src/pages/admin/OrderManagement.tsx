
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCcw, Bell } from 'lucide-react';

interface OrderManagementProps {
  onOrderUpdate?: () => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ onOrderUpdate }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [newOrderSound] = useState(new Audio('/notification.mp3'));
  
  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
    
    // Set up realtime subscription for new orders
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('New order received:', payload);
          const newOrder = payload.new;
          
          // Add the new order to the top of the list
          setOrders(prevOrders => [newOrder, ...prevOrders]);
          
          // Play notification sound for new orders
          if (newOrder.status === 'PENDING') {
            // Show browser notification if permitted
            if (Notification.permission === 'granted') {
              new Notification('Nová objednávka', {
                body: `Nová objednávka od ${newOrder.customer_name}`,
                icon: '/favicon.ico'
              });
            }
            
            // Play sound
            try {
              newOrderSound.play();
            } catch (error) {
              console.error('Failed to play notification sound:', error);
            }
            
            // Show toast
            toast('Nová objednávka!', {
              description: `Od: ${newOrder.customer_name} - ${newOrder.total_amount}€`,
              action: {
                label: 'Zobraziť',
                onClick: () => setStatusFilter('PENDING')
              }
            });
          }
          
          // Update dashboard stats if callback provided
          if (onOrderUpdate) onOrderUpdate();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order updated:', payload);
          const updatedOrder = payload.new;
          
          // Update the order in the list
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === updatedOrder.id ? updatedOrder : order
            )
          );
          
          // Update dashboard stats if callback provided
          if (onOrderUpdate) onOrderUpdate();
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
  }, [onOrderUpdate, newOrderSound]);
  
  // Filter orders when status filter or orders change
  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);
  
  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Nastala chyba pri načítavaní objednávok');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update order status
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      
      // Update local orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Objednávka #${orderId.substring(0, 8)} aktualizovaná na "${getStatusLabel(newStatus)}"`);
      
      // Update dashboard stats if callback provided
      if (onOrderUpdate) onOrderUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Nastala chyba pri aktualizácii stavu objednávky');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Status filter */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Button
            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('ALL')}
            className={statusFilter === 'ALL' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Všetky
          </Button>
          
          <Button
            variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('PENDING')}
            className={statusFilter === 'PENDING' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Čakajúce
          </Button>
          
          <Button
            variant={statusFilter === 'CONFIRMED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('CONFIRMED')}
            className={statusFilter === 'CONFIRMED' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Potvrdené
          </Button>
          
          <Button
            variant={statusFilter === 'PREPARING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('PREPARING')}
            className={statusFilter === 'PREPARING' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Pripravované
          </Button>
          
          <Button
            variant={statusFilter === 'READY' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('READY')}
            className={statusFilter === 'READY' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Pripravené
          </Button>
          
          <Button
            variant={statusFilter === 'DELIVERING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('DELIVERING')}
            className={statusFilter === 'DELIVERING' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Doručované
          </Button>
          
          <Button
            variant={statusFilter === 'COMPLETED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('COMPLETED')}
            className={statusFilter === 'COMPLETED' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Dokončené
          </Button>
          
          <Button
            variant={statusFilter === 'CANCELLED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('CANCELLED')}
            className={statusFilter === 'CANCELLED' ? 'bg-kebab-primary hover:bg-kebab-primary/90' : ''}
          >
            Zrušené
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          className="ml-2"
        >
          <RefreshCcw size={16} className="mr-1" />
          Obnoviť
        </Button>
      </div>
      
      {/* Orders list */}
      <div className="divide-y max-h-[calc(100vh-300px)] overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Načítavanie objednávok...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Žiadne objednávky na zobrazenie
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onUpdateStatus={handleUpdateStatus} 
            />
          ))
        )}
      </div>
    </div>
  );
};

interface OrderItemProps {
  order: any;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Parse items from JSON if needed
    if (typeof order.items === 'string') {
      try {
        setItems(JSON.parse(order.items));
      } catch (e) {
        console.error('Failed to parse order items:', e);
        setItems([]);
      }
    } else {
      setItems(order.items || []);
    }
  }, [order.items]);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'PENDING':
        return 'CONFIRMED';
      case 'CONFIRMED':
        return 'PREPARING';
      case 'PREPARING':
        return 'READY';
      case 'READY':
        return order.delivery_method === 'DELIVERY' ? 'DELIVERING' : 'COMPLETED';
      case 'DELIVERING':
        return 'COMPLETED';
      default:
        return null;
    }
  };

  return (
    <div className={`p-4 ${order.status === 'PENDING' ? 'bg-yellow-50' : ''}`}>
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center">
            <h3 className="font-bold">#{order.id.substring(0, 8)}</h3>
            {order.status === 'PENDING' && (
              <Bell size={16} className="ml-2 text-yellow-500 animate-bounce" />
            )}
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
          
          <p className="text-sm mt-1">
            {order.customer_name} • {order.customer_phone}
          </p>
          
          <p className="text-sm text-gray-500">
            {order.delivery_method === 'DELIVERY' ? `Doručenie: ${order.delivery_address}` : 'Osobný odber'}
          </p>
        </div>
        
        <div className="text-right">
          <span className="font-bold">{parseFloat(order.total_amount).toFixed(2)} €</span>
          <p className="text-sm text-gray-500">
            {order.payment_method === 'CASH' ? 'Hotovosť' : 
             order.payment_method === 'CARD' ? 'Kartou pri doručení' : 'Online platba'}
          </p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Položky objednávky:</h4>
            
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between font-bold">
              <span>Celkom</span>
              <span>{parseFloat(order.total_amount).toFixed(2)} €</span>
            </div>
            
            {/* Customer info section */}
            <div className="mt-4 pt-2 border-t border-gray-200">
              <h5 className="font-medium mb-2">Kontaktné údaje:</h5>
              <p className="text-sm">Meno: {order.customer_name}</p>
              <p className="text-sm">Telefón: {order.customer_phone}</p>
              {order.customer_email && <p className="text-sm">Email: {order.customer_email}</p>}
              {order.delivery_address && (
                <p className="text-sm">Adresa: {order.delivery_address}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2 justify-end">
            {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
              >
                Zrušiť objednávku
              </Button>
            )}
            
            {getNextStatus(order.status) && (
              <Button
                size="sm"
                className="bg-kebab-primary hover:bg-kebab-primary/90"
                onClick={() => onUpdateStatus(order.id, getNextStatus(order.status)!)}
              >
                {getNextStatusLabel(order.status)}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Čaká sa';
    case 'CONFIRMED':
      return 'Potvrdené';
    case 'PREPARING':
      return 'Príprava';
    case 'READY':
      return 'Pripravené';
    case 'DELIVERING':
      return 'Doručuje sa';
    case 'DELIVERED':
      return 'Doručené';
    case 'COMPLETED':
      return 'Dokončené';
    case 'CANCELLED':
      return 'Zrušené';
    default:
      return status;
  }
};

const getNextStatusLabel = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Potvrdiť objednávku';
    case 'CONFIRMED':
      return 'Začať prípravu';
    case 'PREPARING':
      return 'Označiť ako pripravené';
    case 'READY':
      return 'Začať doručovanie';
    case 'DELIVERING':
      return 'Označiť ako dokončené';
    default:
      return 'Ďalší krok';
  }
};

const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800';
    case 'PREPARING':
      return 'bg-purple-100 text-purple-800';
    case 'READY':
      return 'bg-indigo-100 text-indigo-800';
    case 'DELIVERING':
      return 'bg-orange-100 text-orange-800';
    case 'DELIVERED':
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default OrderManagement;


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OrderDetails, OrderStatus } from '@/types';
import { toast } from 'sonner';

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetails[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  
  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    // Sort by date (newest first)
    const sortedOrders = savedOrders.sort((a: OrderDetails, b: OrderDetails) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sortedOrders);
    setFilteredOrders(sortedOrders);
  }, []);
  
  // Filter orders based on status
  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);
  
  // Update order status
  const handleUpdateStatus = (orderId: string | undefined, newStatus: OrderStatus) => {
    if (!orderId) return;
    
    // Update orders in state
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    // Update orders in localStorage
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Update current order in localStorage if it's the same order
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder') || '{}');
    if (currentOrder && currentOrder.id === orderId) {
      localStorage.setItem('currentOrder', JSON.stringify({ ...currentOrder, status: newStatus }));
    }
    
    toast.success(`Objednávka #${orderId} aktualizovaná na "${getStatusLabel(newStatus)}"`);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Status filter */}
      <div className="p-4 border-b">
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
        </div>
      </div>
      
      {/* Orders list */}
      <div className="divide-y">
        {filteredOrders.length === 0 ? (
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
  order: OrderDetails;
  onUpdateStatus: (orderId: string | undefined, newStatus: OrderStatus) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState(false);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'PENDING':
        return 'CONFIRMED';
      case 'CONFIRMED':
        return 'PREPARING';
      case 'PREPARING':
        return 'READY';
      case 'READY':
        return order.deliveryMethod === 'DELIVERY' ? 'DELIVERING' : 'COMPLETED';
      case 'DELIVERING':
        return 'COMPLETED';
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center">
            <h3 className="font-bold">Objednávka #{order.id}</h3>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusBadgeColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </p>
          
          <p className="text-sm mt-1">
            {order.customerName} • {order.customerPhone}
          </p>
          
          <p className="text-sm text-gray-500">
            {order.deliveryMethod === 'DELIVERY' ? `Doručenie: ${order.deliveryAddress}` : 'Osobný odber'}
          </p>
        </div>
        
        <div className="text-right">
          <span className="font-bold">{order.totalAmount.toFixed(2)} €</span>
          <p className="text-sm text-gray-500">
            {order.paymentMethod === 'CASH' ? 'Hotovosť' : 
             order.paymentMethod === 'CARD' ? 'Kartou pri doručení' : 'Online platba'}
          </p>
        </div>
      </div>
      
      {expanded && (
        <div className="mt-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Položky objednávky:</h4>
            
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-2 border-t border-gray-200 flex justify-between font-bold">
              <span>Celkom</span>
              <span>{order.totalAmount.toFixed(2)} €</span>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
            >
              Zrušiť objednávku
            </Button>
            
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
const getStatusLabel = (status: OrderStatus): string => {
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

const getNextStatusLabel = (status: OrderStatus): string => {
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

const getStatusBadgeColor = (status: OrderStatus): string => {
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

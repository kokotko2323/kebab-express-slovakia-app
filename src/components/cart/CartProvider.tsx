
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';
import { toast } from 'sonner';

type CartContextType = {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  hasPromotion: boolean;
  promotionDiscount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasPromotion, setHasPromotion] = useState(false);
  const [promotionDiscount, setPromotionDiscount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      checkForPromotions(items);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Check for promotions
  const checkForPromotions = (items: CartItem[]) => {
    // Check for Coca-Cola promotion (buy 2+ Coca-Cola, get €2 off)
    const cocaColaItems = items.filter(item => 
      item.name.toLowerCase().includes("coca cola") && 
      (item.id === "120" || item.id === "121" || item.id === "122" || item.id === "123" || item.id === "124")
    );
    
    const cocaColaCount = cocaColaItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cocaColaCount >= 2) {
      setHasPromotion(true);
      setPromotionDiscount(2);
    } else {
      setHasPromotion(false);
      setPromotionDiscount(0);
    }
  };

  const addItem = (item: MenuItem, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        // Item already exists, update quantity
        const updatedItems = prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
        toast.success(`${item.name} množstvo upravené na ${existingItem.quantity + quantity}x`);
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        toast.success(`${item.name} pridané do košíka`);
        return [...prevItems, { ...item, quantity }];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(i => i.id === itemId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.name} odstránené z košíka`);
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Košík bol vyčistený');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  ) - promotionDiscount;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    hasPromotion,
    promotionDiscount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

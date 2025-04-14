
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useRestaurantData() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*');
      
      if (orderError) throw orderError;
      
      setOrdersCount(orders?.length || 0);
      
      const pending = orders?.filter(order => 
        ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(order.status)
      ).length || 0;
      setPendingOrders(pending);
      
      const revenue = orders?.reduce((sum, order) => 
        order.status !== 'CANCELLED' ? sum + parseFloat(order.total_amount) : sum, 0
      ) || 0;
      setTotalRevenue(revenue);
      
      // Fix for the type error - explicitly convert count to number if needed
      const { count, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (userError) throw userError;
      
      // Fix TypeScript error by ensuring count is a number
      setUsersCount(count !== null ? Number(count) : 0);
      
      const { data: settings, error: settingsError } = await supabase
        .from('restaurant_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      if (settings) {
        setIsRestaurantOpen(settings.is_open);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Nastala chyba pri načítavaní dát');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const toggleRestaurantStatus = async () => {
    try {
      const { data: settings, error: getError } = await supabase
        .from('restaurant_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (getError && getError.code !== 'PGRST116') throw getError;
      
      if (settings) {
        const { error: updateError } = await supabase
          .from('restaurant_settings')
          .update({ is_open: !settings.is_open })
          .eq('id', settings.id);
        
        if (updateError) throw updateError;
        
        setIsRestaurantOpen(!settings.is_open);
        toast.success(!settings.is_open 
          ? 'Reštaurácia bola otvorená' 
          : 'Reštaurácia bola zatvorená');
      } else {
        const { error: insertError } = await supabase
          .from('restaurant_settings')
          .insert({ is_open: false });
        
        if (insertError) throw insertError;
        
        setIsRestaurantOpen(false);
        toast.success('Reštaurácia bola zatvorená');
      }
    } catch (error) {
      console.error('Error toggling restaurant status:', error);
      toast.error('Nastala chyba pri aktualizácii stavu reštaurácie');
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  return {
    ordersCount,
    pendingOrders,
    totalRevenue,
    usersCount,
    isRestaurantOpen,
    isLoading,
    fetchDashboardData,
    toggleRestaurantStatus
  };
}

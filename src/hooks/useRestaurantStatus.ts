
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RestaurantSettings {
  is_open: boolean;
  custom_message: string | null;
  id: number;
}

export function useRestaurantStatus() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('restaurant_settings')
          .select('*')
          .order('id', { ascending: true })
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setIsOpen(data.is_open);
          setCustomMessage(data.custom_message);
        }
      } catch (err: any) {
        console.error('Error fetching restaurant status:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Set up a realtime subscription to update status when it changes
    const channel = supabase
      .channel('restaurant_status_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'restaurant_settings'
        },
        (payload) => {
          const newData = payload.new as RestaurantSettings;
          setIsOpen(newData.is_open);
          setCustomMessage(newData.custom_message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { isOpen, customMessage, isLoading, error };
}

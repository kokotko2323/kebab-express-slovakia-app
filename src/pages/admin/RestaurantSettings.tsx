
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Save } from 'lucide-react';

const RestaurantSettings = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setIsOpen(data.is_open);
        setCustomMessage(data.custom_message || '');
      }
    } catch (error) {
      console.error('Error fetching restaurant settings:', error);
      toast.error('Nastala chyba pri načítavaní nastavení');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Get current settings
      const { data, error: getError } = await supabase
        .from('restaurant_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .single();
      
      if (getError && getError.code !== 'PGRST116') throw getError;
      
      if (data) {
        // Update existing settings
        const { error } = await supabase
          .from('restaurant_settings')
          .update({ 
            is_open: isOpen,
            custom_message: customMessage
          })
          .eq('id', data.id);
        
        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase
          .from('restaurant_settings')
          .insert({ 
            is_open: isOpen,
            custom_message: customMessage
          });
        
        if (error) throw error;
      }
      
      toast.success('Nastavenia boli úspešne uložené');
    } catch (error) {
      console.error('Error saving restaurant settings:', error);
      toast.error('Nastala chyba pri ukladaní nastavení');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        Načítavanie nastavení...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Nastavenia reštaurácie</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Restaurant Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Stav reštaurácie</h3>
          
          <div className="flex items-center gap-4">
            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                isOpen
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200'
              }`}
              onClick={() => setIsOpen(true)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isOpen
                      ? 'border-green-500'
                      : 'border-gray-300'
                  }`}
                >
                  {isOpen && (
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  )}
                </div>
                <span className="font-medium">Otvorené</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 pl-7">
                Zákazníci môžu objednávať
              </p>
            </div>
            
            <div
              className={`flex-1 border rounded-lg p-4 cursor-pointer ${
                !isOpen
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    !isOpen
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                >
                  {!isOpen && (
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  )}
                </div>
                <span className="font-medium">Zatvorené</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 pl-7">
                Zákazníci nemôžu objednávať
              </p>
            </div>
          </div>
        </div>
        
        {/* Custom Message */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Vlastná správa</h3>
          <p className="text-sm text-gray-500">
            Táto správa sa zobrazí zákazníkom, keď je reštaurácia zatvorená
          </p>
          
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            className="input-field w-full h-24"
            placeholder="Napríklad: Reštaurácia je dnes zatvorená z technických príčin."
          />
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-kebab-primary hover:bg-kebab-primary/90"
          >
            {isSaving ? (
              'Ukladá sa...'
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Uložiť nastavenia
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantSettings;

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCcw, Mail, Phone, Calendar } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users from auth schema
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Get user orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');
      
      if (ordersError) throw ordersError;
      
      // Process and combine user data
      const processedUsers = authUsers?.users.map(user => {
        const userOrders = orders?.filter(order => order.user_id === user.id) || [];
        const totalSpent = userOrders.reduce((sum, order) => 
          order.status !== 'CANCELLED' ? sum + parseFloat(order.total_amount) : sum, 0);
        
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'Neznámy zákazník',
          phone: user.user_metadata?.phone || '',
          address: user.user_metadata?.address || '',
          createdAt: user.created_at,
          lastSignIn: user.last_sign_in_at,
          orderCount: userOrders.length.toString(), // Converted orderCount to string
          totalSpent
        };
      }) || [];
      
      setUsers(processedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Nastala chyba pri načítavaní používateľov');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Zoznam zákazníkov</h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUsers}
        >
          <RefreshCcw size={16} className="mr-1" />
          Obnoviť
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Načítavanie používateľov...
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Žiadni používatelia na zobrazenie
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zákazník</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Registrácia</TableHead>
                <TableHead>Objednávky</TableHead>
                <TableHead className="text-right">Celkové útraty</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name || 'Neznámy zákazník'}
                    {user.address && (
                      <p className="text-xs text-gray-500 mt-1">{user.address}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-sm">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1 text-gray-400" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Posledné prihlásenie: {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Nikdy'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.orderCount}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {user.totalSpent.toFixed(2)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

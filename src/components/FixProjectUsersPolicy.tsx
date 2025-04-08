
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const FixProjectUsersPolicy = () => {
  const [isFixing, setIsFixing] = useState(false);

  const handleFixPolicy = async () => {
    try {
      setIsFixing(true);
      const { data, error } = await supabase.functions.invoke('fix_project_users_policy');

      if (error) {
        throw error;
      }

      console.log('Policy fix result:', data);
      toast({
        title: 'Success',
        description: 'Project users policy fixed successfully. Please refresh the page.',
      });
    } catch (error: any) {
      console.error('Error fixing policy:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fix project users policy',
        variant: 'destructive',
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-lg font-medium mb-2">Fix Database Policy Error</h3>
      <p className="text-muted-foreground mb-4">
        There's an issue with the database policies causing "infinite recursion" errors.
        Click the button below to fix this issue.
      </p>
      <Button onClick={handleFixPolicy} disabled={isFixing}>
        {isFixing ? 'Fixing...' : 'Fix Database Policy'}
      </Button>
    </div>
  );
};

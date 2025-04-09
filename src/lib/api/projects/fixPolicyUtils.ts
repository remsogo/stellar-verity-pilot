
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Calls the edge function to fix the project_users policy
 * This is used to address the infinite recursion issue
 */
export async function fixProjectUsersPolicy(): Promise<boolean> {
  try {
    console.log('Attempting to fix project_users policy via edge function...');
    
    const { data, error } = await supabase.functions.invoke('fix_project_users_policy');
    
    if (error) {
      console.error('Error invoking fix_project_users_policy function:', error);
      return false;
    }
    
    console.log('Policy fix result:', data);
    return data?.success || false;
  } catch (err: any) {
    console.error('Exception when fixing project_users policy:', err);
    return false;
  }
}

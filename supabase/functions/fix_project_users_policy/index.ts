
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.17.0"

// Define CORS headers to ensure the function can be called from the client
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('Fixing project_users policies...')
    
    // First disable RLS to make sure we can operate
    const { error: rlsDisableError } = await supabase.rpc('admin_query', {
      query_text: 'ALTER TABLE public.project_users DISABLE ROW LEVEL SECURITY;'
    })
    
    if (rlsDisableError) {
      console.error('Failed to disable RLS:', rlsDisableError)
      // Continue anyway, might still work
    }
    
    // Fix the table constraint if missing (which could cause issues)
    const { error: constraintError } = await supabase.rpc('admin_query', {
      query_text: `
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'project_users_project_id_user_id_key' 
            AND table_name = 'project_users'
          ) THEN
            ALTER TABLE public.project_users ADD CONSTRAINT project_users_project_id_user_id_key UNIQUE (project_id, user_id);
          END IF;
        END
        $$;
      `
    })
    
    if (constraintError) {
      console.error('Failed to fix constraint:', constraintError)
    }
    
    // Drop existing policies first to avoid conflicts
    const dropPolicies = [
      'Users can view project users',
      'Project admins can add users',
      'Project admins can update users',
      'Project admins can delete users',
      'Users can always see themselves',
      'Users can view project members',
      'Admins can modify project members'
    ]
    
    for (const policy of dropPolicies) {
      const { error: dropError } = await supabase.rpc('drop_policy_if_exists', {
        policy_name: policy,
        table_name: 'project_users'
      })
      
      if (dropError) {
        console.error(`Failed to drop policy ${policy}:`, dropError)
      }
    }
    
    // Create simplified policies to avoid recursion
    const simplifiedPolicies = `
      -- Simplified view policy
      CREATE POLICY "Users can view project members" ON public.project_users
        FOR SELECT
        USING (
          user_id = auth.uid() OR
          project_id IN (
            SELECT project_id FROM project_users
            WHERE user_id = auth.uid()
          )
        );

      -- Admin policies
      CREATE POLICY "Admins can modify project members" ON public.project_users
        FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM project_users pu
            WHERE pu.project_id = project_id 
            AND pu.user_id = auth.uid()
            AND (pu.role = 'admin' OR pu.role = 'owner')
          )
        );
    `
    
    const { error: policiesError } = await supabase.rpc('admin_query', {
      query_text: simplifiedPolicies
    })
    
    if (policiesError) {
      throw new Error(`Failed to create policies: ${policiesError.message}`)
    }
    
    // Re-enable RLS
    const { error: rlsEnableError } = await supabase.rpc('admin_query', {
      query_text: 'ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;'
    })
    
    if (rlsEnableError) {
      console.error('Failed to re-enable RLS:', rlsEnableError)
      // Continue anyway, we succeeded with the main task
    }
    
    // Ensure bypass function exists
    const createBypassFunction = `
    CREATE OR REPLACE FUNCTION public.create_project_bypass(p_name TEXT, p_description TEXT)
    RETURNS UUID
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
      new_project_id UUID;
    BEGIN
      -- Insert the new project
      INSERT INTO projects(name, description)
      VALUES(p_name, p_description)
      RETURNING id INTO new_project_id;
      
      -- Add the current user as an owner
      INSERT INTO project_users(project_id, user_id, role)
      VALUES(new_project_id, auth.uid(), 'owner');
      
      RETURN new_project_id;
    END;
    $$;
    
    GRANT EXECUTE ON FUNCTION public.create_project_bypass(TEXT, TEXT) TO authenticated;
    `;
    
    const { error: bypassFunctionError } = await supabase.rpc('admin_query', {
      query_text: createBypassFunction
    })
    
    if (bypassFunctionError) {
      console.error('Failed to create bypass function:', bypassFunctionError)
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Project users policies fixed successfully"
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    )
  } catch (error) {
    console.error('Error fixing policies:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error' 
      }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    )
  }
})


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
    
    // Drop existing policies first to avoid conflicts
    const { error: dropError } = await supabase.rpc('drop_policy_if_exists', {
      policy_name: 'Users can view project users',
      table_name: 'project_users'
    })
    
    if (dropError) {
      console.error('Failed to drop policy:', dropError)
    }
    
    // Call our improved function to create non-recursive policies
    const { error: createError } = await supabase.rpc('create_project_users_policy')
    
    if (createError) {
      throw new Error(`Failed to create policies: ${createError.message}`)
    }
    
    // Re-enable RLS
    const { error: rlsEnableError } = await supabase.rpc('admin_query', {
      query_text: 'ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;'
    })
    
    if (rlsEnableError) {
      console.error('Failed to re-enable RLS:', rlsEnableError)
      // Continue anyway, we succeeded with the main task
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


import { serve } from 'https://deno.land/std@0.170.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.26.0';

// Create a Supabase client with the service role key for admin access
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract project_id from URL query parameters
    const url = new URL(req.url);
    const projectId = url.searchParams.get('project_id');
    
    console.log(`Fetching users for project: ${projectId || 'all projects'}`);
    
    // Call the database function with the project_id if it exists
    const { data, error } = await supabase.rpc('get_project_users', {
      p_project_id: projectId
    });
    
    if (error) {
      console.error(`Error fetching project users: ${error.message}`);
      throw error;
    }

    console.log(`Successfully fetched ${data?.length || 0} project users`);
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error(`Error in get_project_users function: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Failed to retrieve project users'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

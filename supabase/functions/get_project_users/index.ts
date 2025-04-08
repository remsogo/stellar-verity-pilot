
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
    
    // Query the project_users table directly with a join to user_profiles
    const { data, error } = await supabase
      .from('project_users')
      .select(`
        id, 
        user_id, 
        role,
        user_profiles!user_id(email, full_name)
      `)
      .eq('project_id', projectId);
    
    if (error) {
      console.error(`Error fetching project users: ${error.message}`);
      throw error;
    }

    // Transform the data to the expected format
    const transformedData = data.map(item => ({
      id: item.id,
      user_id: item.user_id,
      email: item.user_profiles?.email || '',
      full_name: item.user_profiles?.full_name || null,
      role: item.role
    }));
    
    console.log(`Successfully fetched ${transformedData.length} project users`);
    
    return new Response(
      JSON.stringify({ success: true, data: transformedData }),
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

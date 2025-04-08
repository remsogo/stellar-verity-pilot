
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
    
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    // First, fetch the project users
    const { data: projectUsers, error: projectUsersError } = await supabase
      .from('project_users')
      .select('id, user_id, role')
      .eq('project_id', projectId);
    
    if (projectUsersError) throw projectUsersError;
    
    // If no users, return empty array
    if (!projectUsers || projectUsers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, data: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Then, fetch the user profiles for those users
    const userIds = projectUsers.map(user => user.user_id);
    const { data: userProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('auth_id, email, full_name')
      .in('auth_id', userIds);
    
    if (profilesError) throw profilesError;
    
    // Combine the data
    const transformedData = projectUsers.map(user => {
      const profile = userProfiles?.find(profile => profile.auth_id === user.user_id);
      return {
        id: user.id,
        user_id: user.user_id,
        email: profile?.email || '',
        full_name: profile?.full_name || null,
        role: user.role
      };
    });
    
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

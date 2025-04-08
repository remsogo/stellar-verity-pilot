
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.17.0"

serve(async (req) => {
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Drop the problematic policy
    const { error: dropError } = await supabase.rpc('drop_policy_if_exists', {
      policy_name: 'Users can view project users',
      table_name: 'project_users'
    })
    
    if (dropError) {
      throw new Error(`Failed to drop policy: ${dropError.message}`)
    }
    
    // Create a new policy that avoids the recursion
    const { error: createError } = await supabase.rpc('create_project_users_policy')
    
    if (createError) {
      throw new Error(`Failed to create policy: ${createError.message}`)
    }
    
    return new Response(
      JSON.stringify({ success: true, message: "Project users policy fixed successfully" }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})

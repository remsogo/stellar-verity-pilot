
import { supabase } from "@/integrations/supabase/client";
import { LoginFormValues } from "./LoginForm";
import { SignupFormValues } from "./SignupForm";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

/**
 * Fetch the current authentication session
 * @returns The current session or null if not authenticated
 */
export const checkAuthSession = async (): Promise<Session | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error checking auth session:", error);
    return null;
  }
};

/**
 * Logs in a user with email and password
 * @param values Login form values containing email and password
 * @returns True if login was successful
 * @throws Error if login fails
 */
export const loginUser = async (values: LoginFormValues): Promise<boolean> => {
  console.log("Attempting login with:", values.email);
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      throw error;
    }

    toast.success("Successfully logged in");
    return true;
  } catch (error) {
    // Error is already toasted inside the first try/catch
    throw error;
  }
};

/**
 * Creates a new user account
 * @param values Signup form values containing email, password, and full name
 * @returns True if signup was successful
 * @throws Error if signup fails
 */
export const signupUser = async (values: SignupFormValues): Promise<boolean> => {
  try {
    const { error: signUpError, data } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
        },
      },
    });

    if (signUpError) {
      console.error("Signup error:", signUpError);
      toast.error(signUpError.message || "Failed to create account");
      throw signUpError;
    }

    if (data?.user) {
      // Create user profile
      const { error: profileError } = await supabase.from("user_profiles").insert({
        auth_id: data.user.id,
        full_name: values.fullName,
        email: values.email,
        role: "tester",
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        toast.error("Account created but failed to set up profile");
        // We don't throw here as the signup was successful
      }
    }

    toast.success("Account created successfully. Please check your email to confirm your account.");
    return true;
  } catch (error) {
    // Error is already toasted in the first try/catch
    throw error;
  }
};

/**
 * Logs out the current user
 * @returns True if logout was successful
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
      return false;
    }
    
    toast.success("Successfully logged out");
    return true;
  } catch (error) {
    console.error("Unexpected logout error:", error);
    toast.error("An unexpected error occurred during logout");
    return false;
  }
};

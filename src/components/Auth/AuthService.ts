
import { supabase } from "@/integrations/supabase/client";
import { LoginFormValues } from "./LoginForm";
import { SignupFormValues } from "./SignupForm";
import { toast } from "sonner";

export const checkAuthSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const loginUser = async (values: LoginFormValues) => {
  console.log("Attempting login with:", values.email);
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
};

export const signupUser = async (values: SignupFormValues) => {
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
    await supabase.from("user_profiles").insert({
      auth_id: data.user.id,
      full_name: values.fullName,
      email: values.email,
      role: "tester",
    });
  }

  toast.success("Account created successfully. Please check your email to confirm your account.");
  return true;
};

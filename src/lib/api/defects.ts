
import { supabase } from "@/integrations/supabase/client";
import { Defect } from "@/types";

export const getDefects = async (): Promise<Defect[]> => {
  const { data, error } = await supabase
    .from("defects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching defects: ${error.message}`);
  }

  return data as Defect[];
};

export const getDefect = async (id: string): Promise<Defect> => {
  const { data, error } = await supabase
    .from("defects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error fetching defect: ${error.message}`);
  }

  return data as Defect;
};

export const createDefect = async (defect: Omit<Defect, "id" | "created_at" | "updated_at">): Promise<Defect> => {
  const { data, error } = await supabase
    .from("defects")
    .insert(defect)
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating defect: ${error.message}`);
  }

  return data as Defect;
};

export const updateDefect = async (id: string, updates: Partial<Defect>): Promise<Defect> => {
  const { data, error } = await supabase
    .from("defects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating defect: ${error.message}`);
  }

  return data as Defect;
};

export const deleteDefect = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("defects")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Error deleting defect: ${error.message}`);
  }
};

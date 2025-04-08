
import { Route } from "react-router-dom";
import Auth from "@/pages/Auth";

export const AuthRoutes = () => {
  return (
    <Route path="/auth" element={<Auth />} />
  );
};

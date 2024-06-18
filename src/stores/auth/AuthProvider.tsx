import React, { ReactNode } from "react";
import AuthContext from "./AuthContext";
import authStore from "./authStore";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthContext.Provider value={{ authStore }}>
      {children}
    </AuthContext.Provider>
  );
};
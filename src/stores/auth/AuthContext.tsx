import { createContext } from "react";
import authStore from "./authStore";

type AuthContextType = {
  authStore: typeof authStore;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;


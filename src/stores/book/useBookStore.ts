import { useContext } from "react";
import BookContext from "./BookContext";

export const useBookStore = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useAuthStore must be used within an AuthProvider");
  }
  return context.bookStore;
};
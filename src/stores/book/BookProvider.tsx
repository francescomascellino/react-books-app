import React, { ReactNode } from "react";
import BookContext from "./BookContext";
import bookStore from "./bookStore";

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BookContext.Provider value={{ bookStore }}>
      {children}
    </BookContext.Provider>
  );
};
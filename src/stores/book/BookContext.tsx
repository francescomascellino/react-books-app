import { createContext } from "react";
import bookStore from "./bookStore";

type BookContextType = {
  bookStore: typeof bookStore;
};

const BookContext = createContext<BookContextType | undefined>(undefined);

export default BookContext;

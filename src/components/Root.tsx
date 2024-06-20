import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../stores/auth/AuthProvider";
import Book from "./Book";
import SingleBook from "./SingleBook";
import EditBook from "./EditBook";

const Root = () => {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/books",
      element: <Book />,
      children: [
        {
          path: ":bookID",
          element: <SingleBook />
        },
        {
          path: ":bookID/edit",
          element: <EditBook />
        }
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default Root
// import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import { AuthProvider } from "../stores/auth/AuthProvider";
import Book from "./Book";
import SingleBook from "./SingleBook";
import EditBook from "./EditBook";

const Root = () => {
  // const [loginCheck, setLoginCheck] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App 
      // loginCheck={loginCheck} setLoginCheck={setLoginCheck}
       />,
    },
    {
      path: "/books",
      element: <Book 
      // loginCheck={loginCheck}
       />,
      children: [
        {
          path: ":bookID",
          element: <SingleBook 
          // loginCheck={loginCheck} 
          />
        },
        {
          path: ":bookID/edit",
          element: <EditBook 
          // loginCheck={loginCheck} 
          />
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
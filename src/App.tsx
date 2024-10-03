import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Import UserProvider
import Login from "./pages/login";
import Home from "./pages/home";
import Layout from "./components/layout/Layout";
import Register from "./pages/register";
import Profile from "./pages/profile";
import UpdateProfile from "./pages/updateProfile";
import VerifyOtp from "./pages/register/VerifyOtp";
import BlogPage from "./pages/blog";
import LienHe from "./pages/lien_he";
import AdminPage from "./pages/adminPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <div>404 - Trang không tìm thấy!</div>,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
          children: [
            {
              path: "VerifyOtp",
              element: <VerifyOtp />,
            },
          ],
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "updateProfile",
          element: <UpdateProfile />,
        },
        {
          path: "blog",
          element: <BlogPage />,
        },
        {
          path: "LienHe",
          element: <LienHe />,
        },

      ],
    },
    {
      path: "admin",
      element: <AdminPage />,
    },
  ]);

  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;

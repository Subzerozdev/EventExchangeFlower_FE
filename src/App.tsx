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
import LienHe from "./pages/contact";
import AdminPage from "./pages/adminPage/AdminPage";
import ProtectedRoute from "./components/routes/ProtectedRoute"; // Import ProtectedRoute
import AddCategory from "./pages/adminPage/CRUDcategory/AddCategory";
import AllProduct from "./components/product";

// Import các trang của Seller
import SellerForm from "./pages/profile/Seller/SellerForm/SellerForm";
import ManagePosts from "./pages/profile/Seller/ManagePosts/ManagePosts";
import ManageShop from "./pages/profile/Seller/ManageShop/ManageShop";
import TermsModal from "./pages/profile/Seller/TermsModal/TermsModal";
import { useState } from "react";
import AddType from "./pages/adminPage/CRUDtype/AddType";
import ProductDetail from "./components/product/detail/ProductDetail";
import Checkout from "./components/checkOut/checkOut";
import ReviewPosts from "./pages/adminPage/ReviewPost/ReviewPost";
import PaymentSuccess from "./components/checkOut/payment/success/PaymentSuccess";
import PaymentFailure from "./components/checkOut/payment/failure/PaymentFaillure";
import ForgotPassword from "./pages/register/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/register/ForgotPassword/ResetPassword";
import VerifyOtpForgotPassword from "./pages/register/ForgotPassword/VerifyOtpForgotPassword";
import LoadingPage from "./components/checkOut/payment/loading/loadingPage";
import ProductList from "./components/product/ProductList/ProductList";
import SoldOrders from "./pages/profile/Seller/SoldOrders/SoldOders";
import Orders from "./pages/profile/orderHistory/Orders";
import OrderDetails from "./pages/profile/Seller/SoldOrders/OrderDetails";
import { NotificationProvider } from "./context/NotificationContext";
import FeedbackForm from "./pages/feedback/feedBack";
import DashBoard from "./pages/adminPage/DashBoard/DashBoard";
import UserManagement from "./pages/adminPage/UserManagement/UserManagement";
import PlatformFee from "./pages/adminPage/PlatFormFee/PlatformFee";
import TermsAndConditions from "./components/Term/TermsAndConditions";
import Details from "./pages/profile/orderHistory/DetailOrder/Detail";
import AdminOrderManagement from "./pages/adminPage/OderManagement/AdminOrderManagement";
import ErrorPayment from "./components/checkOut/payment/error/errorPayment";
import AdminNotificationPage from "./pages/adminPage/ManageNotify/AdminNotificationPage";
import AdminReports from "./pages/adminPage/adminReport/AdminReports";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm xử lý khi người dùng đồng ý với điều khoản
  const handleAgree = () => {
    console.log("Người dùng đã đồng ý với điều khoản");
  };

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
          path: "TermsAndConditions",
          element: <TermsAndConditions />,
        },
        {
          path: "forgot-password/verify-otp",
          element: <VerifyOtpForgotPassword />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "forgot-password/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "VerifyOtp",
          element: <VerifyOtp />,
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
          path: "orders",
          element: <Orders />,
        },
        {
          path: "order_details/:id",
          element: <Details />,
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
        {
          path: "productList",
          element: <AllProduct />,
        },
        {
          path: "posts/:id",
          element: <ProductList />,
        },
        {
          path: "productDetail/:id",
          element: <ProductDetail />,
        },
        {
          path: "checkOut",
          element: <Checkout />,
        },
        {
          path: "/loadingPage",
          element: <LoadingPage />,
        },
        {
          path: "/paymentSuccess",
          element: <PaymentSuccess />,
        },
        {
          path: "/paymentFailure",
          element: <PaymentFailure />,
        },
        {
          path: "/errorPayment",
          element: <ErrorPayment />,
        },
        {
          path: "feedBack",
          element: <FeedbackForm />,
        },

        // Route dành cho Seller (phân quyền)
        {
          path: "seller",
          element: (
            <ProtectedRoute rolesAllowed={["ROLE_SELLER", "ROLE_ADMIN"]} />
          ),
          children: [
            { path: "form", element: <SellerForm /> },
            { path: "sold-orders", element: <SoldOrders /> },
            { path: "sold-orders/:id", element: <OrderDetails /> },
            { path: "manage-posts", element: <ManagePosts /> },
            { path: "manage-shop", element: <ManageShop /> },

            {
              path: "fee", // Đảm bảo đúng tên đường dẫn        element: <PlatformFee />,
            },
            {
              path: "term",
              element: (
                <TermsModal
                  isModalVisible={isModalVisible}
                  setIsModalVisible={setIsModalVisible}
                  onAgree={handleAgree}
                />
              ),
            },
          ],
        },
      ],
    },
    {
      path: "admin",
      element: <ProtectedRoute rolesAllowed={["ROLE_ADMIN"]} />,
      children: [
        {
          path: "",
          element: <AdminPage />,
          children: [
            {
              path: "categories",
              element: <AddCategory />,
            },
            {
              path: "review-posts",
              element: <ReviewPosts />,
            },
            {
              path: "dashboard",
              element: <DashBoard />,
            },
            {
              path: "usermanagement",
              element: <UserManagement />,
            },
            { path: "order-management", element: <AdminOrderManagement /> },
            { path: "notifications", element: <AdminNotificationPage /> },
            { path: "reports", element: <AdminReports /> },
            {
              path: "types",
              element: <AddType />,
            },

            {
              path: "fee",
              element: <PlatformFee />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <UserProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </UserProvider>
  );
}

export default App;

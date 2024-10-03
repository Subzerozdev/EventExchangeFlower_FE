import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import { message } from "antd";  // Import thư viện thông báo

interface ProtectedRouteProps {
    roleRequired: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roleRequired }) => {
    const { user } = useUser();
    const [redirect, setRedirect] = useState<string | null>(null);

    useEffect(() => {
        if (user.role && user.role !== roleRequired) {
            message.error("Bạn không có quyền truy cập vào trang này!");
            setRedirect("/");  // Chuyển hướng về trang chủ nhưng không xóa session
        }
    }, [user.role, roleRequired]);

    // Kiểm tra nếu người dùng chưa đăng nhập
    if (!user.role) {
        return <Navigate to="/login" />;
    }

    // Nếu cần chuyển hướng
    if (redirect) {
        return <Navigate to={redirect} />;
    }

    // Render các route con nếu người dùng có đúng vai trò
    return <Outlet />;
};

export default ProtectedRoute;

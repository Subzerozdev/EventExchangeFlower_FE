import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from "../../context/UserContext";
import { message } from "antd"; // Thư viện thông báo

interface ProtectedRouteProps {
    rolesAllowed: string[]; // Nhận danh sách các vai trò được phép
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ rolesAllowed }) => {
    const { user } = useUser(); // Lấy thông tin người dùng từ context
    const [redirect, setRedirect] = useState<string | null>(null);

    // Chỉ kiểm tra quyền khi `user.role` đã được xác định (không null hoặc undefined)
    useEffect(() => {
        if (user.role && !rolesAllowed.includes(user.role)) {
            message.error("Bạn không có quyền truy cập vào trang này!");
            setRedirect("/"); // Chuyển hướng về trang chủ
        }
    }, [user.role, rolesAllowed]);

    if (!user.role) {
        return <Navigate to="/login" />; // Điều hướng nếu chưa đăng nhập
    }

    if (redirect) {
        return <Navigate to={redirect} />; // Điều hướng nếu không có quyền
    }

    return <Outlet />; // Render các route con nếu có quyền
};

export default ProtectedRoute;

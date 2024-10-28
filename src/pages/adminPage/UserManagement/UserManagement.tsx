import { useEffect, useState } from 'react';
import api from '../../../config/api'; // Import API instance
import './UserManagement.scss'; // Import SCSS

interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    address: string;
    balance: number;
    createdAt: string;  // Ngày tạo tài khoản
    updatedAt: string | null;  // Ngày cập nhật tài khoản
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        api.get('/api/admin/user', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((response) => {
                setUsers(response.data);
                setFilteredUsers(response.data);
            })
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    // Hàm xử lý xóa người dùng
    const deleteUser = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
            api.delete(`/api/admin/user/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
                .then(() => {
                    alert('Xóa người dùng thành công!');
                    // Cập nhật danh sách người dùng sau khi xóa
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                    setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                })
                .catch((error) => console.error('Error deleting user:', error));
        }
    };

    // Hàm xử lý tìm kiếm và lọc người dùng
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        filterUsers(term, roleFilter);
    };

    const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value;
        setRoleFilter(role);
        filterUsers(searchTerm, role);
    };

    const filterUsers = (term: string, role: string) => {
        let filtered = users;

        if (term) {
            filtered = filtered.filter((user) =>
                user.fullName.toLowerCase().includes(term.toLowerCase())
            );
        }

        if (role) {
            filtered = filtered.filter((user) => user.role === role);
        }

        setFilteredUsers(filtered);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Chưa cập nhật';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div>
            <h1>Quản Lý Người Dùng</h1>

            {/* Phần Tìm kiếm và Bộ lọc */}
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={roleFilter} onChange={handleRoleFilter}>
                    <option value="">Tất cả vai trò</option>
                    <option value="ROLE_ADMIN">Quản trị viên</option>
                    <option value="ROLE_CUSTOMER">Khách hàng</option>
                    <option value="ROLE_SELLER">Người bán</option>
                </select>
            </div>

            {/* Bảng hiển thị người dùng */}
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Vai trò</th>
                        <th>Địa chỉ</th>
                        <th>Số dư</th>
                        <th>Ngày Tạo</th>
                        <th>Ngày Cập Nhật</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role}</td>
                            <td>{user.address}</td>
                            <td>{user.balance.toLocaleString('vi-VN')} VND</td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>{formatDate(user.updatedAt)}</td>
                            <td>
                                {user.role !== 'ROLE_ADMIN' ? (
                                    <button onClick={() => deleteUser(user.id)}>Xóa</button>
                                ) : (
                                    <span>Không thể xóa</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;

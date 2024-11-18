import React, { useEffect, useState } from "react";
import { InputNumber, Button, message, Spin } from "antd";
import api from "../../../config/api";
import "./PlatformFee.scss";

interface Fee {
    type: string;
    amount: number;
}

const PlatformFee: React.FC = () => {
    const [fee, setFee] = useState<Fee | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [newAmount, setNewAmount] = useState<number>(0);

    useEffect(() => {
        fetchFee();
    }, []);

    const fetchFee = async () => {
        try {
            const response = await api.get<Fee>("/api/user/fee");
            const feeData = response.data;
            setFee(feeData);
            setNewAmount(feeData.amount);
            setLoading(false);
        } catch (error) {
            console.error(error);
            message.error("Không thể tải dữ liệu phí.");
        }
    };

    const updateFee = async () => {
        try {
            await api.put("/api/admin/fee", { amount: newAmount });
            message.success("Cập nhật phí thành công!");
            fetchFee();
        } catch (error) {
            console.error(error);
            message.error("Cập nhật phí thất bại.");
        }
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div className="platform-fee-page">
            <div className="platform-fee-container">
                <h2>Cập Nhật Phí Nền Tảng</h2>
                {fee && <p className="fee-type">Loại phí: Phí nền tảng phụ thu vào mỗi đơn hàng</p>}
                <div className="input-container">
                    <label>Phần trăm phí hiện tại:</label>
                    <InputNumber
                        min={0}
                        max={100}
                        value={newAmount}
                        onChange={(value) => setNewAmount(value || 0)}
                        formatter={(value) => `${value}%`}
                        parser={(value) => parseFloat(value?.replace('%', '') || '0')}
                    />
                </div>

                <Button className="update-button" onClick={updateFee}>
                    Cập nhật phí
                </Button>
            </div>
        </div>
    );
};

export default PlatformFee;

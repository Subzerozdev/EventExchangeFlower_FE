import { Modal, Checkbox, Button } from "antd";
import { useState, useEffect } from "react";

interface TermsModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    onAgree: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isModalVisible, setIsModalVisible, onAgree }) => {
    const [isAgreed, setIsAgreed] = useState(false);
    const [platformFee, setPlatformFee] = useState<number | null>(null);

    useEffect(() => {
        if (isModalVisible) {
            // Gọi API để lấy phí nền tảng khi modal mở
            fetch('/api/user/fee')
                .then(response => response.json())
                .then(data => {
                    if (data && data.amount) {
                        setPlatformFee(data.amount);
                    }
                })
                .catch(error => {
                    console.error("Lỗi khi lấy phí nền tảng:", error);
                });
        }
    }, [isModalVisible]);

    const handleOk = () => {
        if (isAgreed) {
            onAgree();
            setIsModalVisible(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Modal
            title="Điều khoản bán hoa dành cho Seller trên nền tảng Hoa Lối Cũ"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk} disabled={!isAgreed}>
                    Đồng ý
                </Button>,
            ]}
        >
            <div style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <p><strong>1. Điều Khoản Bán Hoa Dành Cho Seller Trên Nền Tảng Hoa Lối Cũ</strong></p>
                <p>Người bán phải đồng ý tài khoản và cung cấp đầy đủ các thông tin cá nhân hoặc tổ chức. Người bán chịu trách nhiệm về chất lượng và các sản phẩm đăng bán.</p>
                <p><strong>2. Quy Trình Đăng Bán Hoa</strong></p>
                <p>Người bán đăng bán hoa trên mục sự kiện hoặc hoa đã qua sử dụng. Không được phép đăng hoa giả, hoa hỏng, hoặc không còn giá trị sử dụng. Người bán cũng cần cung cấp ảnh chụp rõ sản phẩm (hoa) khi đăng bán, cùng với mô tả chi tiết về sản phẩm, bao gồm loại hoa, chất lượng, và thời gian trồng.</p>
                <p><strong>3. Quy Định Về Giá Cả</strong></p>
                <p>Giá hoa đăng bán phải được người bán quyết định một cách hợp lý dựa trên tình trạng của hoa và thị trường hiện hành. Người bán không được phép tăng giá bất hợp lý hoặc bán hoa với mức giá làm loạn thị trường.</p>
                <p><strong>4. Chính Sách Giao Hàng</strong></p>
                <p>Người bán có trách nhiệm đóng gói và gửi sản phẩm đến khách hàng đúng thời gian đã cam kết. Các chi phí liên quan đến vận chuyển sẽ do người bán hoặc người mua chịu chi phí, điều này cần được thống nhất trước khi đặt hàng.</p>
                <p><strong>5. Chính Sách Đổi Trả</strong></p>
                <p>Người bán cần đảm bảo chính sách đổi trả trong trường hợp hoa giao không đúng với mô tả, không đúng số lượng, hoặc hoa bị hỏng trong quá trình vận chuyển. Nếu có vấn đề phát sinh trong quá trình mua bán, vui lòng liên hệ quản trị viên qua hotline: 0912345678.</p>
                <p><strong>6. Trách Nhiệm Của Người Bán</strong></p>
                <p>Người bán phải chịu trách nhiệm về tất cả các sản phẩm đăng bán đầu đủ đáp ứng chất lượng và tiêu chuẩn của Hoa Lối Cũ.</p>
                <p><strong>7. Quyền Hạn Của Hoa Lối Cũ</strong></p>
                <p>Hoa Lối Cũ có quyền kiểm soát và quyết định các nội dung đăng bán vi phạm nội quy của nền tảng.</p>
                <p><strong>8. Chính Sách Bảo Mật Thông Tin</strong></p>
                <p>Tất cả thông tin cá nhân và doanh nghiệp của người bán sẽ được bảo mật tuyệt đối theo chính sách của nền tảng Hoa Lối Cũ.</p>
                <p><strong>9. Phí Dịch Vụ</strong></p>
                <p>Người bán sẽ chịu chi phí khi bán hoa thành công trên nền tảng. Tỷ lệ phần trăm phí dịch vụ là {platformFee !== null ? `${platformFee * 100}%` : 'đang tải...'}.</p>
                <p><strong>10. Thanh Toán Và Giá Hạn</strong></p>
                <p>Giao dịch sẽ hoàn tất khi người bán đã nhận đủ tiền từ khách hàng thông qua phương thức thanh toán mà Hoa Lối Cũ chấp nhận.</p>
            </div>

            <Checkbox onChange={(e) => setIsAgreed(e.target.checked)}>
                Tôi đã đọc và đồng ý với điều khoản
            </Checkbox>
        </Modal>
    );
};

export default TermsModal;

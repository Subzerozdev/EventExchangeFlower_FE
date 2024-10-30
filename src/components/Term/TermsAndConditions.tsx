import React from 'react';
import './TermsAndConditions.scss';

const TermsAndConditions: React.FC = () => {
    const sections = [
        {
            title: '1. Điều Khoản Bán Hoa Dành Cho Seller Trên Nền Tảng Hoa Lối Cũ',
            content: [
                'Người bán phải đăng ký tài khoản và cung cấp đầy đủ các thông tin cá nhân hoặc thông tin doanh nghiệp như họ tên, địa chỉ, số điện thoại và các thông tin cần thiết khác.',
                'Tài khoản bán hàng chỉ được xác minh sau khi có thỏa thuận bán sản phẩm hoa.',
                'Người bán phải chịu trách nhiệm và cam kết cung cấp hoa có chất lượng cao.'
            ],
        },
        {
            title: '2. Quy Trình Đăng Bán Hoa',
            content: [
                'Hoa đăng bán phải là hoa tươi và có sự kiện hoặc hoa được tái sử dụng. Không được phép đăng bán hoa giả, hoa đã hư hỏng, hoặc không còn giá trị sử dụng.',
                'Hoa đăng bán vi phạm quy định hoặc các sản phẩm bị phát hiện không đạt tiêu chuẩn sẽ bị gỡ bỏ mà không cần thông báo trước.',
            ],
        },
        {
            title: '3. Quy Định Về Giá Cả',
            content: [
                'Giá hoa đăng bán phải minh bạch và được định mức phù hợp với thị trường.',
                'Người bán không được phép tăng giá đột biến mà không báo trước với khách hàng.',
            ],
        },
        {
            title: '4. Chính Sách Giao Hàng',
            content: [
                'Người bán chịu trách nhiệm đóng gói và gửi sản phẩm đến khách hàng đúng thời gian cam kết.',
                'Hoa Lối Cũ khuyến khích người bán sử dụng dịch vụ vận chuyển uy tín.',
            ],
        },
        {
            title: '5. Chính Sách Đổi Trả',
            content: [
                'Người bán cần cung cấp chính sách đổi trả hợp lý và giải quyết khiếu nại trong vòng 7 ngày kể từ khi giao hàng.',
                'Hoa phải được đổi trả nếu không đạt chất lượng cam kết.',
            ],
        },
        {
            title: '6. Trách Nhiệm Của Người Bán',
            content: [
                'Người bán chịu trách nhiệm đảm bảo chất lượng sản phẩm và dịch vụ cung cấp.',
                'Mọi hành vi gian lận, lừa đảo hoặc cung cấp thông tin sai sự thật sẽ bị xử lý nghiêm khắc.',
            ],
        },
    ];

    return (
        <div className="terms-container">
            <h1>Điều Khoản Bán Hàng Dành Cho Seller Trên Nền Tảng Hoa Lối Cũ</h1>
            <p className="intro-text">
                Chào mừng bạn đến với Hoa Lối Cũ, nền tảng mua bán hoa trực tuyến uy tín.
                Để đảm bảo quyền lợi cho cả hai bên, người bán cần tuân thủ các điều khoản sau.
            </p>
            {sections.map((section, index) => (
                <div key={index} className="terms-section">
                    <h2>{section.title}</h2>
                    <ul>
                        {section.content.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default TermsAndConditions;

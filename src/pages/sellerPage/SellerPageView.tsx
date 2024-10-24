// import React, { useEffect, useState } from 'react';
// import { Card, Avatar, Button, Descriptions, Spin, message } from 'antd';
// import { UserOutlined } from '@ant-design/icons';

// import api from '../../config/api';

// const { Meta } = Card;



// interface SellerProfile {
//   id: number;
//   description: string;
//   qr_code: string;
//   shop_address: string;
//   shop_image: string;
//   shop_name: string;
//   user_id: number;
// }

// const SellerProfile: React.FC<{ shopId: number }> = ({ shopId }) => {
//   const [shopData, setShopData] = useState<SellerProfile | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchShopData = async () => {
//       try {
//         const response = await api.get(`/api/seller/shop/${shopId}`);
//         setShopData(response.data);
//       } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu cửa hàng:', error);
//         message.error('Không thể tải dữ liệu cửa hàng');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShopData();
//   }, [shopId]);

//   if (loading) {
//     return <Spin tip="Đang tải dữ liệu..." />;
//   }

//   if (!shopData) {
//     return <div>Không tìm thấy dữ liệu cửa hàng.</div>;
//   }

//   return (
//     <div className="seller-profile-container">
//       <Card
//         style={{ width: 300, margin: '0 auto' }}
//         cover={<img alt="Shop" src={shopData.shop_image || 'https://via.placeholder.com/300'} />}
//         actions={[
//           <Button type="primary" key="store">Gian hàng</Button>,
//           <Button key="message">Nhắn tin</Button>,
//         ]}
//       >
//         <Meta
//           avatar={<Avatar size={64} icon={<UserOutlined />} />}
//           title={shopData.shop_name}
//           description={`ID Cửa hàng: ${shopData.id}`}
//         />
//       </Card>

//       <Card style={{ marginTop: 20 }}>
//         <Descriptions title="Thông tin cửa hàng" bordered>
//           <Descriptions.Item label="Tên cửa hàng">{shopData.shop_name}</Descriptions.Item>
//           <Descriptions.Item label="Mô tả">{shopData.description}</Descriptions.Item>
//           <Descriptions.Item label="Địa chỉ">{shopData.shop_address}</Descriptions.Item>
//           <Descriptions.Item label="QR Code">{shopData.qr_code}</Descriptions.Item>
//           <Descriptions.Item label="ID Người dùng">{shopData.user_id}</Descriptions.Item>
//         </Descriptions>
//       </Card>
//     </div>
//   );
// };

// export default SellerProfile;

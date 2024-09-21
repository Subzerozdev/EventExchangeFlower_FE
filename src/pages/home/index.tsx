import { Card, Carousel, Col, Row } from "antd";
import "./home.scss";
/////////////////////////////////////////////////////////////
const features = [
  {
    title: "Xuất hóa đơn VAT",
    description: "Chúng tôi hỗ trợ xuất hóa đơn cho mọi đơn hàng.",
  },
  { title: "Giao hàng nhanh", description: "Giao hoa tươi trong vòng 2 giờ." },
  {
    title: "Chất lượng tốt",
    description: "Luôn đảm bảo chất lượng hoa tươi nhất.",
  },
];
/////////////////////////////////////////////////////////////
const categories = [
  {
    title: "Bó hoa tươi",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F2.jpg?alt=media&token=c2309de2-9a1e-4c07-ba0b-5cefdd30badf",
  },
  {
    title: "Hoa trang trí tiệc cưới",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F3.jpg?alt=media&token=34d04a12-0124-4a1d-8ee8-21ac58348116",
  },
  {
    title: "Hoa khai trương",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F4.jpg?alt=media&token=116a524d-a30c-4b4d-a11c-5213eddf55ce",
  },
];

/////////////////////////////////////////////////////////////
const testimonials = [
  { name: "Anh Tùng", text: "Dịch vụ rất tuyệt vời!" },
  { name: "Chị Hoa", text: "Hoa tươi đẹp, giao hàng nhanh chóng." },
  { name: "Chị Hạnh", text: "Hoa tươi đẹp, giao hàng nhanh chóng." },
  { name: "Chị Kim", text: "Hoa tươi đẹp, giao hàng nhanh chóng." },
  { name: "Anh Hội", text: "Hoa tươi đẹp, giao hàng nhanh chóng." },
  { name: "Anh Khang", text: "Hoa tươi đẹp, giao hàng nhanh chóng." },
  { name: "Bé Nghi", text: "Hoa tươi đẹp, giao hàng nhanh chóng." },
];
const Home = () => {
  return (
    <div className="homepage">
      {/*------------------------------------------- */}
      <div className="homepage__img">
        <a href="#">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2Fslider_1.jpg?alt=media&token=f73569e5-04cd-40ad-98f4-04079c4d82bd"
            width="100%"
            height="100%"
          ></img>
        </a>
      </div>
      {/*------------------------------------------- */}
      <div className="homepage__features">
        <Row gutter={16}>
          {features.map((feature, index) => (
            <Col key={index} span={8}>
              <Card title={feature.title}>
                <p>{feature.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {/*------------------------------------------- */}
      <div className="homepage__category">
        <h2>Danh Mục Hoa Nổi Bật</h2>
        <Row gutter={16}>
          {categories.map((category, index) => (
            <Col key={index} span={8}>
              <Card cover={<img alt={category.title} src={category.imgSrc} />}>
                <Card.Meta title={category.title} />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {/*------------------------------------------ */}
      <div className="homepage__img">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2F5.jpg?alt=media&token=c7d24c9b-2584-4f33-b69b-3a972e0d262d"
          alt="3buoc"
          width="90%"
          height="100%"
        />
      </div>

      {/*------------------------------------------- */}
      <div className="homepage__testimonials">
        <h2>Khách Hàng Nói Gì Về Chúng Tôi</h2>
        <Carousel autoplay>
          {testimonials.map((testimonial, index) => (
            <div key={index}>
              <h3>{testimonial.text}</h3>
              <p> {testimonial.name}</p>
            </div>
          ))}
        </Carousel>
      </div>
      <div className="homepage__reason">
        <h3>Tại Sao Nên Chọn Mua Hoa Thanh Lý Từ Nền Tảng Của Chúng Tôi?</h3>

        <p>
          Sản Phẩm Đa Dạng Từ Các Tiệm Hoa Thanh Lý Uy Tín Khi bạn cần hoa tươi
          cho một dịp đặc biệt nhưng không muốn bỏ ra quá nhiều chi phí, nền
          tảng Hoa Lối Cũ là lựa chọn tuyệt vời để tìm kiếm những bó hoa thanh
          lý chất lượng. Chúng tôi kết nối bạn với các tiệm hoa địa phương, giúp
          bạn dễ dàng tìm kiếm và mua những bó hoa với giá ưu đãi mà vẫn đảm bảo
          sự tươi mới và chất lượng cao. Bạn chỉ cần chọn hoa trên nền tảng, nhà
          cung cấp hoa sẽ liên hệ trực tiếp để hoàn tất việc giao hàng nhanh
          chóng.
        </p>
        <h3>Sản Phẩm Đa Dạng Từ Các Tiệm Hoa Thanh Lý Uy Tín</h3>
        <p>
          Hoa thanh lý không có nghĩa là hoa kém chất lượng. Tại Hoa Lối Cũ, bạn
          có thể tìm thấy mọi loại hoa cho các dịp như sinh nhật, khai trương,
          hay các buổi tiệc, với mức giá giảm mà vẫn giữ được sự trang trọng và
          tinh tế. Chúng tôi luôn chú trọng đến việc lựa chọn và chăm sóc từng
          bó hoa, đảm bảo mỗi sản phẩm đến tay khách hàng đều đẹp và mang thông
          điệp yêu thương đầy ý nghĩa.
        </p>
        <h3>Gửi Đi Yêu Thương Qua Nền Tảng Hoa Thanh Lý</h3>

        <p>
          Tại Hoa Lối Cũ, chúng tôi tin rằng, dù là hoa thanh lý nhưng thông
          điệp yêu thương và cảm xúc mà bạn muốn gửi đi vẫn nguyên vẹn. Thông
          qua nền tảng của chúng tôi, bạn có thể dễ dàng đặt những bó hoa phù
          hợp cho mọi dịp, từ sinh nhật, lễ kỷ niệm đến những sự kiện quan
          trọng. Chúng tôi giúp bạn gửi gắm tình cảm đến người nhận qua những bó
          hoa chất lượng, tinh tế và giá cả phải chăng.
        </p>
      </div>
      {/*------------------------------------------- */}
    </div>
  );
};

export default Home; // Export mặc định

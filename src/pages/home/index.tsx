import { Carousel as AntCarousel, List } from "antd";
import {
  CheckCircleOutlined,
  DollarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import "./index.scss";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";

const testimonials = [
  {
    content:
      "“Dịch vụ của Hoa Lối Cũ thật sự tuyệt vời! Tôi đã đặt một bó hoa cho ngày sinh nhật của mẹ và kết quả thật đáng kinh ngạc. Hoa tươi, được bó rất đẹp và chất lượng hoàn toàn vượt ngoài mong đợi. Chắc chắn tôi sẽ tiếp tục sử dụng dịch vụ trong tương lai!”",
    author: "Chị Nguyễn Thị Lan Anh",
    location: "Bình Dương",
    image:
      "https://th.bing.com/th/id/OIP.0yjWQLJmtSeg1EnL1MfLVgHaJI?rs=1&pid=ImgDetMain", // URL ảnh của khách hàng
  },
  {
    content:
      "“Hoa Lối Cũ đã giúp tôi gửi đi một bó hoa tươi tuyệt đẹp cho đối tác của mình. Rất nhanh chóng và chất lượng cao!”",
    author: "Anh Lê Trung Tín",
    title: "CEO of Diamond Coin",
    image:
      "https://media.yeah1.com/files/ngoctran/2022/07/01/289693821_582015943280803_2102006602626651935_n-205941.jpg", // URL ảnh của khách hàng
  },
  {
    content:
      "“Dịch vụ tại đây rất tuyệt vời, tôi sẽ giới thiệu cho bạn bè mình!”",
    author: "Nguyễn Văn Bảo",
    location: "Đồng Nai",
    image:
      "https://th.bing.com/th/id/OIP.6RRfL6mRhmtl54O0HdU78wHaLH?rs=1&pid=ImgDetMain", // URL ảnh của khách hàng
  },
];
const images = [
  "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FNguoiCay%20(6).png?alt=media&token=ebd1fa0f-e368-4ca7-b3d7-7bd1e76a9436",
  "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2F1.png?alt=media&token=2fc49122-3ab8-4918-8d3b-ff65622a0926",
  "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2F3.png?alt=media&token=b42b3dcf-1340-4e03-b5a6-7ce7b743d441",
];

const featuredCategories = [
  {
    title: "Bó hoa tươi",
    img: "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FFeatured%20Categories%2FhoaHongSiuTo.jpg?alt=media&token=ac7a0eee-869d-4a03-a88b-837a69a32f51",
  },
  {
    title: "Hoa trang trí tiệc cưới",
    img: "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FFeatured%20Categories%2FGoi-y-cach-trang-tri-ban-tho-gia-tien-le.jpg?alt=media&token=249a3756-7ead-4fa9-a19d-6063ace2e42a",
  },
  {
    title: "Hoa chúc mừng - Hoa khai trương",
    img: "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FFeatured%20Categories%2Fhoa%20lan.jpg?alt=media&token=4534328c-0ccc-44a9-9524-84a4741bdfbd",
  },
];

const steps = [
  {
    title: "Bước 1: Chọn bó hoa hoặc dịch vụ trang trí hoa cho sự kiện.",
    icon: (
      <CheckCircleOutlined style={{ fontSize: "24px", color: "#FFD700" }} />
    ),
  },
  {
    title: "Bước 2: Thanh toán đơn giản",
    description:
      "Thanh toán trực tuyến qua QR VNPAY, hỗ trợ mọi ngân hàng tại Việt Nam .",
    icon: <DollarOutlined style={{ fontSize: "24px", color: "#FF5733" }} />,
  },
  {
    title: "Bước 3: Hoàn tất đơn hàng và chờ hoa giao đến nhà của bạn",
    icon: <HomeOutlined style={{ fontSize: "24px", color: "#00BFFF" }} />,
  },
];

const Home = () => {
  return (
    <div>
      {/* Phần Carousel */}
      <AntCarousel autoplay>
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Slide ${index}`} className="carousel-image" />
          </div>
        ))}
      </AntCarousel>

      {/* Phần hỗ trợ */}
      <section className="support-section">
        <h2>Chúng Tôi Có Đội Ngũ Hỗ Trợ Chuyên Nghiệp</h2>
        <div className="support-features">
          <div className="feature">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FLogo%20Support%2F4.png?alt=media&token=f07c75fd-3d16-4879-a399-e1e437ddcdf7"
              alt="VAT Support"
            />
            <h3>Xuất hóa đơn VAT</h3>
            <p>Xuất VAT trong ngày! (8%)</p>
          </div>
          <div className="feature">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FLogo%20Support%2F5.png?alt=media&token=0e90483f-d6c2-4561-90af-62be7ce4ea93"
              alt="On-Time Delivery"
            />
            <h3>Giao hàng đúng giờ</h3>
            <p>Cam kết giao hàng đúng giờ, đảm bảo sản phẩm luôn tươi</p>
          </div>
          <div className="feature">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FLogo%20Support%2F6.png?alt=media&token=a114de93-0e1a-494a-a322-ae359cf92d1b"
              alt="Quality First"
            />
            <h3>Ưu tiên chất lượng là hàng đầu</h3>
            <p>
              Hoa Lối Cũ luôn đề cao chất lượng hoa tươi cũng như trải nghiệm
              khách hàng lên hàng đầu
            </p>
          </div>
          <div className="feature">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2FCarousel%2FLogo%20Support%2F7.png?alt=media&token=d71ea870-f2a0-4cbd-9ec9-414871f1f8c1"
              alt="Customer Support"
            />
            <h3>Hotline hỗ trợ khách hàng</h3>
            <p>
              Liên hệ 0922314123 để được hỗ trợ giải đáp thắc mắc, khiếu nại.
            </p>
          </div>
        </div>

        {/* Nút Call to Action */}
        <div className="cta-button">
          <button onClick={() => window.location.href = '/blog'}>
            Bấm để tìm hiểu về chúng tôi
          </button>
        </div>

      </section>

      {/* Danh Mục Hoa Nổi Bật */}
      <section className="featured-categories">
        <h2>Danh Mục Hoa Nổi Bật</h2>
        <div className="category-list">
          {featuredCategories.map((category, index) => (
            <div className="category-item" key={index}>
              <img
                src={category.img}
                alt={category.title}
                className="category-image"
              />
              <h3>{category.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Đặt Hoa Dễ Dàng Với 3 Bước và Ảnh Bên Phải */}
      <section className="order-steps">
        <h2>Đặt Hoa Dễ Dàng Với 3 Bước</h2>
        <div className="order-content">
          <List
            itemLayout="horizontal"
            dataSource={steps}
            renderItem={(step) => (
              <List.Item>
                <List.Item.Meta
                  avatar={step.icon}
                  title={<span className="step-title">{step.title}</span>}
                  description={step.description}
                />
              </List.Item>
            )}
          />
          <div className="product-image-container">
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/HomePage%2FEasy%20to%20oder%2FFlower%20project%20(1).png?alt=media&token=bd38b1fa-2b02-48d1-a923-4f2b1854d69d"
              }
              alt="Hoa tươi chất lượng cao"
              className="product-image"
              width={100}
            />
          </div>
        </div>
      </section>
      {/* Phần khách hàng nói gì về chúng tôi */}
      <section className="testimonials-section">
        <h2>Khách Hàng Nói Gì Về Chúng Tôi</h2>
        <AntCarousel autoplay dots>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-item">
              <div className="testimonial-image-container">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="testimonial-image"
                />
              </div>
              <p className="testimonial-content">{testimonial.content}</p>
              <p className="testimonial-author">{testimonial.author}</p>
              {testimonial.location && (
                <p className="testimonial-location">{testimonial.location}</p>
              )}
            </div>
          ))}
        </AntCarousel>
      </section>
      <ScrollToTop />
    </div>
  );
};

export default Home;

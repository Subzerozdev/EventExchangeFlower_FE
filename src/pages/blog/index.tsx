import React from "react";
import "./Blog.scss";
import ScrollToTop from "../../components/scrollToTop/ScrollToTop";

const BlogPage: React.FC = () => {
    return (
        <div className="blog-page">
            {/* Header */}
            <div className="blog-header">
                <h3>Nền Tảng "Hoa Lối Cũ" Là GÌ Và Chúng Tôi Hướng Tới Ai?</h3>
            </div>

            {/* Giới thiệu về Hoa Lối Cũ */}
            <div className="blog-content">
                <div className="blog-text">
                    <h1>HOA LỐI CŨ</h1>
                    <p>
                        Chào mừng bạn đến với Hoa Lối Cũ - nền tảng tiên phong trong việc
                        mua bán lại hoa thừa sau sự kiện. Chúng tôi mang đến cơ hội cho cá
                        nhân và doanh nghiệp không chỉ tiết kiệm chi phí khi mua hoa mà còn
                        góp phần vào việc bảo vệ môi trường bằng cách tái sử dụng hoa đã qua
                        sử dụng. Hoa Lối Cũ không chỉ là một dịch vụ, mà là sự kết nối giữa
                        vẻ đẹp tự nhiên và trách nhiệm với môi trường.
                    </p>
                    <p>
                        Với hơn 5 năm kinh nghiệm trong lĩnh vực tái chế hoa, Hoa Lối Cũ đã
                        xây dựng một cộng đồng yêu hoa và bảo vệ môi trường. Chúng tôi đã
                        hợp tác với nhiều tổ chức từ thiện, lễ hội lớn, và các sự kiện quan trọng,
                        giúp hàng ngàn bông hoa được tái sinh và tạo nên những khoảnh khắc ý nghĩa.
                    </p>
                    <p>
                        Bên cạnh đó, chúng tôi còn cung cấp các giải pháp sáng tạo để sử dụng
                        lại hoa, từ trang trí nhà cửa, văn phòng, đến các sản phẩm thủ công mỹ nghệ
                        đầy tinh tế. Với chúng tôi, mỗi bông hoa đều mang giá trị, và việc tái sử dụng
                        chúng không chỉ mang lại lợi ích kinh tế mà còn góp phần vào việc bảo vệ
                        tài nguyên thiên nhiên của trái đất.
                    </p>
                </div>
                <div className="blog-image">
                    <img
                        src={
                            "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2F2.jpg?alt=media&token=99186305-748f-4eae-9589-99a7c03e9dc9"
                        }
                        alt="Hoa Lối Cũ"
                    />
                </div>
            </div>

            {/* Sứ mệnh và tầm nhìn */}
            <div className="mission-vision-section">
                <div className="mission-vision-image">
                    <img
                        src={
                            "https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2F4.jpg?alt=media&token=7541ae34-3869-4825-83ec-32435a6a9ba0"
                        }
                        alt="Sứ Mệnh"
                    />
                </div>
                <div className="mission-vision-text">
                    <div className="mission">
                        <h2>SỨ MỆNH</h2>
                        <p>
                            Hoa Lối Cũ tôn vinh giá trị của hoa và hướng đến bảo vệ môi trường
                            thông qua việc giảm thiểu lãng phí hoa tươi. Sứ mệnh của chúng tôi
                            là mang đến những giá trị bền vững cho hoa, giúp hoa tiếp tục hành
                            trình của mình sau các sự kiện và mang lại niềm vui cho nhiều người
                            hơn nữa.
                        </p>
                        <p>
                            Chúng tôi cam kết thực hiện các hoạt động bảo vệ môi trường thông
                            qua việc tổ chức các sự kiện giáo dục cộng đồng, nâng cao nhận thức
                            về việc tái sử dụng hoa, và tạo ra các giải pháp kinh doanh thân thiện
                            với môi trường.
                        </p>
                    </div>
                    <div className="vision">
                        <h2>TẦM NHÌN</h2>
                        <p>
                            Trở thành nền tảng tái sử dụng hoa sự kiện lớn nhất và phổ biến
                            nhất tại Việt Nam, đồng thời lan tỏa thông điệp bảo vệ môi trường
                            đến cộng đồng. Hoa Lối Cũ không chỉ là dịch vụ, mà còn là cầu nối
                            giữa sự sáng tạo, nghệ thuật và sự phát triển bền vững của xã hội.
                        </p>
                    </div>
                </div>
            </div>

            {/* Lợi ích khi sử dụng dịch vụ */}
            <div className="benefits-section">
                <h2>LỢI ÍCH KHI DÙNG DỊCH VỤ CỦA CHÚNG TÔI</h2>
                <div className="benefits-content">
                    <div className="benefit-item">
                        <h3>1. Tiết kiệm chi phí</h3>
                        <p>
                            Với dịch vụ của Hoa Lối Cũ, bạn có thể tiết kiệm lên đến 50% chi phí
                            khi sử dụng hoa đã qua sự kiện mà vẫn giữ được chất lượng và vẻ đẹp.
                            Đây là giải pháp lý tưởng cho những ai muốn tổ chức sự kiện mà không
                            phải chi trả quá nhiều cho hoa tươi.
                        </p>
                    </div>
                    <div className="benefit-item">
                        <h3>2. Bảo vệ môi trường</h3>
                        <p>
                            Việc tái sử dụng hoa góp phần giảm thiểu lượng rác thải sinh học, giúp
                            bảo vệ môi trường, giảm khí thải carbon và giảm thiểu việc sử dụng tài
                            nguyên thiên nhiên. Chúng tôi cam kết phát triển dịch vụ xanh, bảo vệ
                            tương lai cho hành tinh.
                        </p>
                    </div>
                    <div className="benefit-item">
                        <h3>3. Tính độc đáo và sáng tạo</h3>
                        <p>
                            Mỗi lần tái sử dụng hoa, chúng tôi không chỉ giữ nguyên vẻ đẹp tự nhiên của
                            chúng mà còn tạo thêm những điểm nhấn sáng tạo, giúp mỗi sự kiện trở nên
                            độc đáo và đặc biệt hơn. Khách hàng sẽ luôn hài lòng với sự tinh tế trong
                            từng sản phẩm.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mẹo bảo quản hoa */}
            <div className="core-values-section">
                <h2 className="section-title">Mẹo Bảo Quản Hoa</h2>
                <div className="core-values-content">
                    <div className="core-values-text">
                        <div className="core-value-item">
                            <h3>1. Tỉa cành và thay nước mỗi ngày</h3>
                            <p>
                                Việc tỉa cành và thay nước thường xuyên là một trong những cách đơn giản nhưng hiệu quả nhất để kéo dài tuổi thọ của hoa tươi. Khi cắt cành hoa, bạn nên sử dụng kéo hoặc dao sắc để tránh làm tổn thương đến thân hoa. Ngoài ra, nên cắt theo góc chéo để tăng diện tích hấp thụ nước. Nước sạch giúp ngăn chặn sự phát triển của vi khuẩn, từ đó giữ cho hoa tươi lâu hơn. Bạn cũng có thể thêm một ít đường hoặc giấm trắng vào nước để cung cấp dưỡng chất và kháng khuẩn cho hoa.
                            </p>
                        </div>
                        <div className="core-value-item">
                            <h3>2. Tránh để hoa gần nguồn nhiệt</h3>
                            <p>
                                Hoa là sinh vật rất nhạy cảm với nhiệt độ. Nhiệt độ cao không chỉ khiến hoa nhanh héo mà còn có thể làm hỏng cánh hoa và làm giảm tuổi thọ của chúng. Khi trang trí hoa trong nhà, hãy chọn những nơi thoáng mát, tránh xa các thiết bị phát nhiệt như bếp lò, lò vi sóng hoặc máy sưởi. Đặc biệt, đừng đặt hoa ở cửa sổ nơi ánh nắng trực tiếp chiếu vào vì ánh nắng có thể làm cánh hoa bị cháy hoặc phai màu.
                            </p>
                        </div>
                        <div className="core-value-item">
                            <h3>3. Sử dụng dung dịch bảo quản hoa</h3>
                            <p>
                                Nếu bạn muốn hoa tươi lâu hơn, dung dịch bảo quản hoa là một lựa chọn tuyệt vời. Những dung dịch này thường chứa các chất dinh dưỡng, chất diệt khuẩn và chất điều hòa sinh trưởng giúp hoa hấp thụ tốt hơn và nở rộ trong thời gian dài. Bạn có thể mua các dung dịch này ở các cửa hàng bán hoa hoặc tự pha chế bằng cách sử dụng nước sạch, một ít đường và giấm trắng hoặc chanh để tạo ra môi trường có độ axit nhẹ.
                            </p>
                        </div>
                        <div className="core-value-item">
                            <h3>4. Đặt hoa vào nước lạnh hoặc dùng đá</h3>
                            <p>
                                Ngoài việc thay nước mỗi ngày, bạn cũng có thể sử dụng nước lạnh hoặc cho thêm vài viên đá vào bình hoa để giúp giữ hoa tươi. Nước lạnh làm chậm quá trình hô hấp và giảm lượng nước mà hoa tiêu thụ, từ đó giúp giữ hoa lâu hơn. Đây là một mẹo hữu ích khi bạn muốn kéo dài tuổi thọ của những loài hoa nhạy cảm với nhiệt độ cao.
                            </p>
                        </div>
                        <div className="core-value-item">
                            <h3>5. Tạo không gian thông thoáng cho hoa</h3>
                            <p>
                                Hoa cần không gian để hô hấp. Nếu đặt hoa quá gần nhau hoặc trong không gian kín, chúng có thể nhanh chóng bị héo. Đảm bảo rằng không gian xung quanh hoa thông thoáng và không có vật cản. Khi cắm hoa, hãy chọn bình có kích thước vừa đủ và đừng cắm quá dày để tránh tình trạng các cành hoa chen chúc làm tổn thương lẫn nhau.
                            </p>
                        </div>
                        <div className="core-value-item">
                            <h3>6. Loại bỏ lá thừa dưới nước </h3>
                            <p>
                                Trước khi cắm hoa vào bình, hãy loại bỏ những lá nằm dưới mực nước. Lá khi ngâm trong nước có thể gây phân hủy, tạo môi trường thuận lợi cho vi khuẩn phát triển, từ đó làm cho nước trong bình bị nhiễm bẩn và hoa nhanh tàn hơn. Việc loại bỏ lá không chỉ giúp nước sạch mà còn giúp hoa hấp thụ nước tốt hơn.
                            </p>
                        </div>
                        <div className="core-value-item">
                            <h3>7. Đổi vị trí hoa vào ban đêm </h3>
                            <p>
                                Nếu có thể, hãy di chuyển hoa vào nơi mát mẻ hơn vào ban đêm, chẳng hạn như trong phòng có nhiệt độ thấp hoặc ngoài trời mát mẻ (nếu điều kiện cho phép). Môi trường mát mẻ vào ban đêm sẽ làm chậm quá trình thoát nước và giúp hoa hồi phục sau một ngày dài trưng bày ở nhiệt độ phòng.
                            </p>
                        </div>
                        <div className="event-image">
                            <img
                                src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2F14.jpg?alt=media&token=38820a12-e34b-4d9f-b211-86e0f5542820"
                                alt="Sự kiện"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Câu chuyện từ sự kiện */}
            <div className="event-story-section">
                <h2>Câu Chuyện Từ Sự Kiện</h2>
                <p>
                    Hoa không chỉ là phụ kiện trang trí mà còn chứa đựng nhiều câu chuyện
                    ý nghĩa từ các sự kiện. Tại Hoa Lối Cũ, chúng tôi đã chứng kiến những
                    bông hoa đi qua nhiều khoảnh khắc đáng nhớ, từ lễ cưới, buổi tiệc, đến
                    các sự kiện văn hóa lớn. Mỗi bông hoa đều gắn liền với một câu chuyện,
                    và hành trình của chúng chưa dừng lại sau khi sự kiện kết thúc.
                </p>
                <p>
                    Một trong những sự kiện đặc biệt mà chúng tôi tham gia là lễ cưới tại
                    Hội An, nơi những bông hoa cũ từ buổi lễ đã được tặng lại cho các tổ
                    chức từ thiện để làm đẹp cho một không gian khác. Đây là minh chứng
                    cho việc một hành động nhỏ có thể lan tỏa sự tử tế và hạnh phúc.
                </p>
                <div className="event-image">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2F8.jpg?alt=media&token=05fdb13e-5855-40bf-a994-e2e2c94d4ce0"
                        alt="Sự kiện"
                    />
                </div>
            </div>

            {/* Ý tưởng trang trí từ hoa thừa */}
            <div className="leftover-flower-section">
                <h2>Ý Tưởng Trang Trí Từ Hoa Thừa</h2>
                <p>
                    Hoa thừa sau sự kiện có thể được sử dụng để tạo ra nhiều tác phẩm nghệ
                    thuật độc đáo. Bạn có thể dùng chúng để làm vòng hoa treo cửa, trang
                    trí cho quán cà phê, hay thậm chí làm quà tặng đầy ý nghĩa. Hoa không
                    chỉ là vẻ đẹp thoáng qua, mà còn có thể tồn tại trong nhiều không gian
                    khác nhau và mang lại niềm vui cho nhiều người.
                </p>
                <p>
                    Một số khách hàng của chúng tôi đã sử dụng hoa thừa để trang trí cho
                    văn phòng làm việc, mang đến một không gian làm việc tươi mới và tràn
                    đầy cảm hứng. Ngoài ra, nhiều cửa hàng cà phê cũng tận dụng hoa thừa
                    để tạo ra không gian xanh mát và gần gũi với thiên nhiên.
                </p>
                <div className="leftover-flower-image">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2F9.jpg?alt=media&token=6d0cb538-b158-4c2e-94f7-19cee6af18c1"
                        alt="Ý tưởng hoa thừa"
                    />
                </div>
                <div className="leftover-flower-image">
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2F11.jpg?alt=media&token=cb6f23a1-a0db-41b8-bebd-6401c54de50a"

                        alt="Ý tưởng hoa thừa"
                    />
                </div>

            </div>




            {/* Phần Giới Thiệu Đội Ngũ */}
            <div className="team-section">
                <h2>Đội Ngũ Của Chúng Tôi</h2>
                <p>
                    Đằng sau sự thành công của Hoa Lối Cũ là một đội ngũ các nhà sáng tạo
                    và chuyên gia có tâm huyết, không ngừng học hỏi để mang đến những giá trị
                    tốt nhất cho khách hàng.
                </p>
                <div className="team-members">
                    <div className="team-member">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2Fmusk.jpg?alt=media&token=fb2039d8-fd01-4003-894b-88ef921202f1"
                            alt="Nguyen Van A"
                        />
                        <h4>Đỗ Nam Trung</h4>
                        <p>Chuyên gia thiết kế hoa, với hơn 10 năm kinh nghiệm trong lĩnh vực tổ chức sự kiện và trang trí.</p>
                    </div>
                    <div className="team-member">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2Fmusk.jpg?alt=media&token=fb2039d8-fd01-4003-894b-88ef921202f1"
                            alt="Le Thi B"
                        />
                        <h4>Đỗ Nam Trung</h4>
                        <p>Nhà sáng tạo nghệ thuật, người luôn đưa ra những ý tưởng táo bạo và sáng tạo trong việc tái sử dụng hoa thừa.</p>
                    </div>
                    <div className="team-member">
                        <img
                            src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2Fmusk.jpg?alt=media&token=fb2039d8-fd01-4003-894b-88ef921202f1"
                            alt="Tran Minh C"
                        />
                        <h4>Yi Long Ma</h4>
                        <p>Chuyên gia quản lý dự án, người điều phối các sự kiện và đảm bảo mọi thứ diễn ra một cách suôn sẻ.</p>
                    </div>
                </div>
            </div>

            {/* Phần Kêu Gọi Hành Động */}
            <div className="cta-section">
                <h2>Bạn Đã Sẵn Sàng Sử Dụng Hoa Lối Cũ?</h2>
                <p>
                    Hãy liên hệ ngay với chúng tôi để được tư vấn miễn phí và tận hưởng những lợi ích
                    tuyệt vời từ dịch vụ tái sử dụng hoa của chúng tôi. Dịch vụ của Hoa Lối Cũ không chỉ
                    giúp tiết kiệm chi phí mà còn mang lại những giá trị bền vững, bảo vệ môi trường và
                    góp phần tạo nên những khoảnh khắc đáng nhớ cho sự kiện của bạn.
                </p>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/blog%2F6.jpg?alt=media&token=f182cfd0-4b87-42ae-b79e-ca2c85e98fb0"
                    alt="Sự kiện với Hoa Lối Cũ"
                />
                <button>Liên Hệ Ngay</button>
            </div>
           <ScrollToTop/>
        </div>
    );
};

export default BlogPage;

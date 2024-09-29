import React from "react";
import "./LienHe.scss";
const LienHe: React.FC = () => {
  return (
    <div className="Contact">
      <div className="Contact_ThongTin">
        <h4>BLOSSOM CORNER - HOA LỐI CŨ</h4>
        <p>
          <span>Địa chỉ:</span> 223 Lâm Văn Bền, Phường Bình Thuận, Quận 7
        </p>
        <p>
          <span>Hotline:</span> 0912345678
        </p>
        <p>
          <span>Email:</span> hoaloicu@gmail.com
        </p>
        <img src="https://firebasestorage.googleapis.com/v0/b/swphoathanhly.appspot.com/o/Hoa%2Fshop-hoa-tuoi-quan-1.jpg?alt=media&token=d74ebb00-01a7-432b-9738-1f61e894bed3" />
      </div>

      <div className="Contact_googleMap">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9098589151945!2d106.71337207475284!3d10.741430459838844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f6d7f0d47d3%3A0x36aaaecfaf4d9051!2sShop%20Hoa%20T%C6%B0%C6%A1i%20Blossom%20Corner!5e0!3m2!1svi!2sus!4v1727603553068!5m2!1svi!2sus"
          width="600"
          height="450"
          allowFullScreen={true}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default LienHe;

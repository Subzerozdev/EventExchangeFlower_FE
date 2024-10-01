import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";

interface HeaderProps {
  OpenSidebar: () => void;
}

function Header({ OpenSidebar }: HeaderProps) {
  return (
    <div className="headers">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="headers-left">
        <BsSearch className="icon" />
      </div>
      <div className="headers-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
    </div>
  );
}

export default Header;

import Dashboard from '../dashboard';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Container from 'react-bootstrap/Container';
import Style from './menu.module.css';

export default function Menu() {
  const [isvalble, setIsvalble] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("index");
  const router = useRouter();

  // Cập nhật selectedStatus khi đường dẫn thay đổi
  useEffect(() => {
    switch (router.pathname) {
      case "/":
        setSelectedStatus("index");
        break;
      case "/user/about":
        setSelectedStatus("about");
        break;
      case "/user/sanpham":
        setSelectedStatus("product");
        break;
      case "/contact":
        setSelectedStatus("FAQ");
        break;
      default:
        setSelectedStatus("");
    }
  }, [router.pathname]);

  // Xử lý sự kiện cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div style={{ background: "#527360", width: "100%", height: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ width: "50%", marginLeft: "100px" }}>
            <menu>
              <ul style={{ display: "flex" }}>
                <li style={{ flex: "1", color: "white" }}>
                  <i className="bi bi-envelope-open"></i> dinhsantruong@gmail.com
                </li>
                <li style={{ flex: "1", textAlign: "center", borderLeft: "1px solid white", color: "white" }}>
                  <i className="bi bi-alarm"></i> 8:00 AM - 6:00 PM T2-T7
                </li>
                <li style={{ flex: "1", textAlign: "center", borderLeft: "1px solid white", color: "white" }}>
                  <i className="bi bi-telephone-fill"></i> 0945375009-0327003624
                </li>
              </ul>
            </menu>
          </div>
          <div style={{ color: "white", width: "33%", textAlign: "right" }}>
            <i style={{ color: "yellow" }} className="bi bi-lightning-fill"></i> Freeship Toàn quốc
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className={`menu-container ${isScrolled ? "scrolled" : ""}`}>
        <Container>
          <div className="menu_user">
            <img className="logo" src="/upload/logo.png" alt="Logo" />
            <div className="Input">
              <input type="text" placeholder="Tìm kiếm..." />
              <button><i className="bi bi-search"></i></button>
            </div>
            <div className="menu_left">
              <nav>
                <ul>
                  <li><Dashboard /></li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Menu chính */}
          <div className="menu_right">
            <div className="category-header">
              <i className="bi bi-menu-up"></i> Danh mục sản phẩm
            </div>
            <nav className="navmenu">
              <ul>
                <li className={selectedStatus === "index" ? Style.status : ""}>
                  <Link href="/">Trang chủ</Link>
                </li>
                <li className={selectedStatus === "about" ? Style.status : ""}>
                  <Link href="/user/about">Giới thiệu</Link>
                </li>
                <li className={selectedStatus === "product" ? Style.status : ""}>
                  <Link href="/user/sanpham">Sản Phẩm</Link>
                </li>
                <li className={selectedStatus === "FAQ" ? Style.status : ""}>
                  <Link href="/contact">FAQ</Link>
                </li>
                <li className={selectedStatus === "phone" ? Style.status : ""}>
                  <Link href="/contact">Liên hệ</Link>
                </li>
              </ul>
            </nav>
          </div>
        </Container>
      </div>

      {/* CSS */}
      <style jsx>{`
        .menu-container {
          background: transparent;
          width: 100%;
        }
        .menu-container.scrolled {
          background: whitesmoke;
          top: 0;
          position: fixed;
          z-index: 1000;
          transition: background 0.3s;
        }
        .category-header {
          width: 300px;
          color: white;
          font-weight: 500;
          height: 50px;
          background: #527360;
          line-height: 50px;
          text-align: center;
          font-size: 20px;
          border-radius: 50px;
        }
      `}</style>
    </>
  );
}

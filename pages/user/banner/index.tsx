import { useState, useEffect } from 'react';
import style from './Banner.module.css';
import Container  from 'react-bootstrap/Container';
export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideImages = [
    "/upload/hinh1.jpg",
    "/upload/hinh2.jpg",
    "/upload/hinh3.jpg"
  ];

  // Chuyển slide tiếp theo
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slideImages.length);
  };

  // Cập nhật slide sau mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  // Hiển thị slide hiện tại
  const showSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
    <Container>
    <div style={{display:"flex" , padding:"30px 0px", paddingTop:"100px"}}>
    <div className={style.banner_container}>
      <div className={style.banner} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slideImages.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index + 1}`} />
        ))}
      </div>
    </div>
<div className={style.banner_index}>
<div className={style.banner2} >
        <img src="/upload/hinh1.jpg" alt="" />
      </div>
      <div className={style.banner2} >
        <img src="/upload/hinh1.jpg" alt="" />
      </div>
      <div className={style.banner2} >
        <img src="/upload/hinh1.jpg" alt="" />
      </div>
      <div className={style.banner2} >
        <img src="/upload/hinh1.jpg" alt="" />
      </div>
</div>
   
    </div>


    </Container>
    </>
  );
}

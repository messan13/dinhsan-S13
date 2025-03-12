import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import style from './sanpham.module.css';
import useSWR from "swr";
import { mutate } from 'swr';
import { useSession } from "next-auth/react";
import {toast } from 'react-toastify';
import Container from 'react-bootstrap/Container';
import Menu from "../menu"
interface IProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function Products() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1); 
  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1); 
  
  const pageSize = 8;

  const handlCarts = async (idproduct:Number) =>{
      if(!session){
        toast.error("Bạn chưa đăng nhập!")
      } else{
        const iduser = session?.user.id
        const data = await fetch('http://localhost:3000/api/carts', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({iduser,idproduct,quantity:Number(1)})
      })
      const kq = await data.json();
      if(kq){
        if(data.status==400)
        toast.warning(kq)
      }
      if(data.status==200){
        toast.success(kq)
        mutate(`http://localhost:3000/api/carts?id=${session.user.id}`)
      }
      }
  }

  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `http://localhost:3000/api/product?page=${currentPage}&limits=${pageSize}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data) {
      setProducts(data.finduser);  
      setTotalPages(data.totalPage);  
    }
  }, [data]);


  if (isLoading) {
    return <p>Loading....</p>;
  }

  if (error) {
    console.log('lỗi ,', error);
    return <p>Error loading data :{error.message}</p>;
  }
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const pageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };
  return (
    <>
    <Container>
      <div style={{padding:'20px 0px'}} className={style.body_cover}>
        <div className={style.body_cover_left}></div>
        <div className={style.body_cover_middle}>SẢN PHẨM</div>
        <div className={style.body_cover_left}></div>
      </div>
      <div className={style.body_nav}>
        {products.map((item) => (
          <div key={item.id} className={style.body_content_one}>
            <div className={style.image_cover}>
              <div className={style.image}>
                <img src={`/${item.image}`} alt={item.name} />
              </div>
            </div>
            <div style={{height:"50px"}} className={style.content}>
              <p>{item.name}</p>
            </div>
            <div className={style.money_cover}>
              {parseFloat(item.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </div>
            <div style={{display:"flex" , justifyContent:'space-around'}}>
            <Button variant="primary" onClick={()=>{
              handlCarts(item.id);
              router.push('/user/cart')
            }} >MUA HÀNG</Button>
            <Button variant="primary" onClick={()=>{
              handlCarts(item.id)
            }} >THÊM GIỎ HÀNG</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      <div style={{paddingTop:"30px",padding:"auto"}} className={style.pagination}>
        <Button 
          variant="secondary" 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {/* Hiển thị các số trang và dấu "..." */}
        {pageNumbers().map((page, index) => (
          <Button
            key={index}
            variant="secondary"
            onClick={() => handlePageChange(typeof page === 'number' ? page : currentPage)}
            active={typeof page === 'number' && currentPage === page}
            disabled={typeof page === 'string'}
          >
            {page}
          </Button>
        ))}

        <Button 
          variant="secondary" 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      </Container>
    </>
  );
}

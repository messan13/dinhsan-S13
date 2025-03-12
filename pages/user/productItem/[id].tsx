import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import Comments from "../comments";
import {toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { mutate } from 'swr';
// Định dạng kiểu dữ liệu sản phẩm
interface IProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  volume: string;
  description: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProductDetail = () => {
  const [quantity,setQuantity] = useState<Number>(0);
  const {data:session,status} = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { data: productItem, error, isLoading } = useSWR<IProduct>(
    id ? `http://localhost:3000/api/product/${id}` : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const handlCarts = async () =>{
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
      body: JSON.stringify({iduser,idproduct:Number(productItem?.id),quantity:Number(quantity)})
    })
    const kq = await data.json();
    if(kq){
      if(data.status==400)
      toast.warning(kq)
      setQuantity(0);
    }
    if(data.status==200){
      toast.success(kq)
      mutate(`http://localhost:3000/api/carts?id=${session.user.id}`)
    }
    }
}



  if (isLoading) return <p className="text-center py-4">Đang tải...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Lỗi tải dữ liệu!</p>;

  return (
    <div className="max-w-7xl mx-auto bg-white p-6">
    <div className="grid grid-cols-2 gap-6">
      {/* Hình ảnh sản phẩm */}
      <div>
        <img src={`/${productItem?.image}`} className="rounded-lg max-w-[600px] h-[600px]" alt="" />
      </div>

      {/* Thông tin sản phẩm */}
      <div>
        <h1 className="text-2xl text-[#527360] font-bold">{productItem?.name}</h1>
        <div className="mt-4">
          <span className="text-red-500 text-3xl font-bold">{productItem?.price}</span>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Vận Chuyển:</span>
            <span className="text-green-600">Miễn phí vận chuyển</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium">Số lượng</label>
          <div className="flex items-center border rounded w-24">
            <button disabled={quantity===0} onClick={()=>setQuantity(Number(quantity)-1)} className="px-2.5 py-1 border-1">-</button>
            <input
              type="text"
              value={Number(quantity)}
              className="w-full text-center px-2 border-none"
              readOnly
              disabled
            />
           <button className="px-2.5 py-1 border-1" onClick={()=>setQuantity(Number(quantity)+1)}>+</button>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button onClick={handlCarts} className="bg-[#527360] text-white px-6 py-2 rounded font-bold">
            Thêm Vào Giỏ Hàng
          </button>
          <button onClick={()=>{
              handlCarts();
              router.push('/user/cart')
            }} className="bg-white text-[#527360] px-6 py-2 border-2 border-[#527360] rounded font-bold">
            Mua Ngay
          </button>
        </div>
      </div>
    </div>
  

      {/* Mô tả sản phẩm */}
      <div dangerouslySetInnerHTML={{ __html: productItem?.description ?? "" }} className="w-full max-w-3xl mx-auto p-4 bg-gray-100 shadow-md rounded-md mt-8" />

      {/* Bình luận */}
      <Comments idproduct={productItem?.id ?? 0} />
    </div>
  );
};


export default ProductDetail;

'use client'
import Style from "./purchase.module.css";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { format, toZonedTime } from "date-fns-tz";
import {toast } from 'react-toastify';
import { useRouter } from "next/router";
import OrderInvoice  from "./orderInvoice";
// Hàm gọi API lấy chi tiết đơn hàng
async function orderItem(id: number) {
  const res = await fetch(`http://localhost:3000/api/orderItem?id=${id}`);
  if (!res.ok) throw new Error("Lỗi khi tải chi tiết đơn hàng");
  return res.json();
}

export default function Purchase() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orderchitiet, setOrdechitiet] = useState<{ [key: number]: any[] } | null>(null)
  const [order,setOrder]=useState<Iorderitem | null>(null);
  const [showOrderInvoice,setshowOrderInvoice]=useState<boolean>(false);
  const [orderItems, setOrderItems] = useState<{ [key: number]: any[] }>({});
  const [openedOrderId, setOpenedOrderId] = useState<string | null>(null);
  const toggleOrderDetails = (orderId: string) => {
    setOpenedOrderId((prev) => (prev === orderId ? null : orderId));
  };
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const orderStatuses : Array<Record<string, string>> = [
    {all:'Tất Cả'}, {pending:"Chưa xác nhận"},{confirmed:"Đã xác nhận"}, {shipper:"Vận chuyển"}, {success:"Hoàn Thành"},
    {cancel:"Đã hủy"}
  ];
const checkValue=(key:any,arr: Array<Record<string, string>>)=>{
    const found =arr.find(obj=>Object.keys(obj)[0]===key)
    return found ? Object.values(found)[0] : null;
}
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Lỗi khi tải dữ liệu đơn hàng");
    return res.json();
  };

  const { data, error, isLoading } = useSWR(
    status === "authenticated" && session?.user.id
      ? `http://localhost:3000/api/order?id=${session?.user.id}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => {
    async function fetchOrderItems() {
      if (data && Array.isArray(data)) {
        const details: { [key: number]: any[] } = {};
        await Promise.all(
          data.map(async (item: any) => {
            details[item.id] = await orderItem(item.id);
          })
        );
        setOrderItems(details);
      }
    }
    fetchOrderItems();
  }, [data]);
  if (error) return <div>{error}</div>;
  if (isLoading) return <div>loading...</div>;
  if (!data || !Array.isArray(data) || data.length < 1) {
    return <p>Không có đơn hàng nào.</p>;
  }

    const valiDate =(dateIso:string)=>{
        const vietnamtime= toZonedTime(dateIso,'Asia/Ho_Chi_Minh');
        const formDate = `${format(vietnamtime,'dd/MM/yyyy')} lúc ${format(vietnamtime,'HH:mm')}`
        return formDate;
    }
    //lọc đơn hàng theo trạng thái
    const filteredOrders = data.filter((order: any) =>
      selectedStatus === "all" || order.status === selectedStatus
    );

    const HandlerCancle = async (id:number)=>{
     const up = await fetch(`http://localhost:3000/api/order/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({status:"cancel"})
      })
      if(up){
           mutate(status === "authenticated" && session?.user.id
          ? `http://localhost:3000/api/order?id=${session?.user.id}`
          : null,);
          return toast("đơn hàng của bạn đã bị hủy")
      }
    }

    const HandleMualai = (id:number,iduser:number)=>{
        orderItems[id].map( async (item)=>{
               const data = await fetch('http://localhost:3000/api/carts', {
            method: 'POST',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({iduser:iduser,idproduct:item.product.id,quantity:Number(1)})
          })
          console.log("giá trị",item.quantity);
          const kq = await data.json();
          if(kq){
            if(data.status==400)
            toast.warning(kq)
          }
          if(data.status==200){
            mutate(`http://localhost:3000/api/carts?id=${session?.user.id}`)
          }
        })
    }


  return (
    <>
    <div className={Style.filter_container}>
  <ul className={Style.filter_list}>
    {orderStatuses.map((status) => (
      <li className={selectedStatus === Object.keys(status)[0] ? Style.active_li : ""} key={Object.keys(status)[0]}>
        <button
          onClick={() => setSelectedStatus(Object.keys(status)[0])}
          className={selectedStatus === Object.keys(status)[0] ? Style.active_filter : ""}
        >
          {Object.values(status)[0]}
        </button>
      </li>
    ))}
  </ul>
</div>
        { filteredOrders.length>0 ? (filteredOrders.map((item: any) => (
        <div className={Style.order_container} key={item.id}>
          <div className={Style.order_header}>
            <div className={Style.shop_info}>
              <span className={Style.shop_date}>Đặt ngày: {valiDate(item.createdAt)}</span>
            </div>
            <span className={Style.order_status}>{checkValue(item.status, orderStatuses)}</span>
          </div>
    
          {orderItems[item.id] ? (
            orderItems[item.id].slice(0,openedOrderId === item.id ? orderItems[item.id]?.length : 1).map((p: any) => (
              <div className={Style.order_body} key={p.id}>
                <img src={`/${p.product.image}`} alt="" className={Style.product_image} />
                <div className={Style.product_info}>
                  <div className={Style.product_name}>{p.product.name}</div>
                  <div style={{color:"#527360"}}>x{p.quantity}</div>
                </div>
                <div className={Style.product_price}>{(parseFloat(p.product.price).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</div>
              </div>
            ))
          ) : (
            <p>Đang tải sản phẩm...</p>
          )}
         
         {orderItems[item.id] && orderItems[item.id].length > 1 && (
            <button onClick={() => toggleOrderDetails(item.id)} className={Style.showMoreBtn}>
              {openedOrderId === item.id ? "Đóng" : "Xem thêm"}
            </button>
          )}
          <div className={Style.order_footer}>
            <div style={{display:"flex",gap:"10px"}}>
              <button onClick={()=>{
                HandleMualai(item.id,item.iduser)
                router.push('/user/cart')
              }} className={`${Style.btn} ${Style.buy_again}`}>Mua Lại</button>
              <button 
              onClick={()=>{
                setshowOrderInvoice(true)
                setOrder(item)
                setOrdechitiet(orderItems[item.id])
              }}
              className={`${Style.btn} ${Style.contact_seller}`}>Xem đơn</button>
              {item.status==='pending' ? (
                 <button onClick={()=>HandlerCancle(Number(item.id))} className={`${Style.btn} ${Style.contact_seller}`}>Hủy đơn hàng</button>
              ):''}
            </div>
            <div style={{display:"flex", gap:"10px" ,height:"30px"}}>
              <p style={{fontSize:"16px",textAlign: 'center',lineHeight:'30px'}}>Thành tiền: </p>
            <span className={Style.total_price}>{(parseFloat(item.totalPrice).toLocaleString as any)('vi-VN', { style: 'currency', currency: 'VND'})}</span>
          </div>
          </div>
        </div>
      ))):(
          <div className={Style.NoOrder}>
            <img src="/upload/order.png" alt="" />
            <p>Chưa có đơn hàng</p>
          </div>
      )}
      <OrderInvoice
      showOrder={showOrderInvoice}
      setShowOrder={setshowOrderInvoice}
      order={order}
      setOrder={setOrder}
      orderItem={orderchitiet}
      setOderItem={setOrdechitiet}
      />
    </>
  );
}

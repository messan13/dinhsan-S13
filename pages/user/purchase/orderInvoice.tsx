"use client";
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React from "react";
import Style from './purchase.module.css';
import { format, toZonedTime } from 'date-fns-tz';
interface Ioders{
    showOrder:boolean,
    setShowOrder : (v:boolean)=> void,
    order: Iorderitem | null ;
    setOrder: (v: Iorderitem | null ) => void;
    orderItem : { [key: number]: any[] } | null,
    setOderItem :(v: { [key: number]: any[] } | null) =>void
}
const OrderDetails= (props:Ioders) => {
 const {showOrder,setShowOrder,order,setOrder,orderItem,setOderItem}= props;
    const valiDate =(dateIso:string)=>{
        const vietnamtime= toZonedTime(dateIso,'Asia/Ho_Chi_Minh');
        const formDate = `${format(vietnamtime,'dd/MM/yyyy')} lúc ${format(vietnamtime,'HH:mm')}`
        return formDate;
    }
    const orderStatuses : Array<Record<string, string>> = [
        {all:'Tất Cả'}, {pending:"Chưa xác nhận"},{confirmed:"Đã xác nhận"}, {shipper:"Vận chuyển"}, {success:"Hoàn Thành"},
        {cancel:"Đã hủy"}
      ];
      const checkValue=(key:any,arr: Array<Record<string, string>>)=>{
        const found =arr.find(obj=>Object.keys(obj)[0]===key)
        return found ? Object.values(found)[0] : null;
    }
 const handleClose = () => {
    setShowOrder(false)
    setOrder(null);
    setOderItem(null)
 };
  return (
    <>
      <Modal show={showOrder} onHide={handleClose} animation={false} size='lg'>
        <Modal.Header closeButton>
        <img style={styles.logo} src="/upload/logo.png" alt=""  />
          <h2 style={styles.heading}>Chi Tiết Đơn Hàng</h2>
        </Modal.Header>
        <Modal.Body>
        <div style={styles.container}>
      <div style={styles.info}>
        <p><strong>Tên khách hàng:</strong> {order?.customer} </p>
        <p><strong>Địa chỉ:</strong> {order?.address} </p>
        <p><strong>Số điện thoại:</strong> {order?.phone} </p>
        <p><strong>Ngày Đặt:</strong>  {order?.createdAt ? valiDate(order.createdAt) : "Chưa có ngày"}</p>
        <p style={{color:"blue",boxShadow:"revert-layer"}}><strong>Trạng thái:</strong> {checkValue(order?.status,orderStatuses)}</p>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.centerText}>Tên hàng</th>
            <th style={styles.centerText}>ĐVT</th>
            <th style={styles.centerText}>Số lượng</th>
            <th style={styles.centerText}>Đơn giá</th>
            <th style={styles.centerText}>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(orderItem ?? {})?.map((item:any) => (
            <tr key={item.id}>
                <td style={styles.centerText}>{item.product.name}</td>
                <td style={styles.centerText}> <img style={{margin:'auto'}} src={`/${item.product.image}`} alt="" className={Style.product_image} /></td>
                <td style={styles.centerText}>{item.quantity}</td>
                <td style={styles.centerText}>{item.price.toLocaleString()}</td>
                <td style={styles.centerText}>{(item.quantity * item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={styles.total}>Tổng: {order?.totalPrice.toLocaleString()} VNĐ</p>
    </div>
        </Modal.Body>
      </Modal>
    </>
   
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  logo:{
    width: "60px",
    height: "50px",
  },
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px"
  },
  heading: {
    color:"#527360"
  },
  info: {
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  total: {
    textAlign: "right",
    fontWeight: "bold",
    paddingTop: "10px",
    color :"red"
  },
  note: {
    marginTop: "20px",
    fontStyle: "italic",
  },
  centerText:{
    textAlign:"center",
    width : "20%"
  }
};

export default OrderDetails;

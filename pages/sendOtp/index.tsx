import React, { useState } from "react";
import {toast } from 'react-toastify';
import { useRouter } from "next/router";
export default function SendOTP() {
  const [email, setEmail] = useState("");
    const router = useRouter();
    
  const handleSendOTP = async (e:React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("http://localhost:3000/api/sendotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
   if(res.status==200){
    toast.success(data)
    setEmail("")
    router.push('http://localhost:3000/sendOtp/verifyOtp')
    sessionStorage.setItem("email", email);
    return
   }else if(res.status==400){
    toast.error(data)
   }
   
  };

  return (
    <div className="flex h-screen bg-[#527360] justify-center items-center">
    <div className="w-1/3 p-8 bg-white shadow-lg rounded-lg">
    <h2 className="text-2xl font-bold text-[#527360] text-center">Nhập Email để nhận mã OTP</h2>
    <form className="mt-4">
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email của bạn" 
        className="w-full p-3 border border-[#527360] rounded-lg mb-3 focus:ring-2 focus:ring-[#527360] focus:outline-none"
      />
      <button 
        onClick={handleSendOTP} 
        className="w-full bg-[#527360] hover:bg-[#415b4e] text-white py-3 rounded-lg font-semibold transition duration-300"
      >Xác nhận</button>
    </form>
 </div>
 </div>
  );
}

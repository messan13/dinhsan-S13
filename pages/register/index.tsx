import Link from "next/link";
import { useState } from "react";
import {toast } from 'react-toastify';
import {mutate} from 'swr'
import { useRouter } from "next/router";
export default function register(){
    const router = useRouter();
    const[name,setName]=useState('')
  const[password,setPassword]=useState('')
  const[email,setEmail]=useState('')
  const [confirmPassword,setConfirmPassword]=useState("")
  const [error,setError]=useState("");
const handlerClose = ()=>{
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("")
}
  function validateEmail(email : any){
    var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
     return regex.test(email)
  }
  function validateName(name :any){
    var regex =/^[a-zA-Z][a-zA-Z0-9_]{2,}$/
    return regex.test(name)
  }

  const handleRegister = async (e: React.FormEvent)=>{
    e.preventDefault();
    if(!name || !email || !password){
        setError("Bạn không được bỏ trống mục name,password hoặc email!")
        toast.error("Đăng ký thất bại")
        return
    }
    if(!validateName(name)){
        setError("Tên phải bắt đầu bằng chữ cái , không có dấu và có it nhất 3 ký tự")
      toast.error("Đăng ký thất bại");
      return                  
    }
    if(!validateEmail(email)){
        setError("Địa chỉ email không phù hợp")
      toast.error("Đăng ký thất bại!");
      return                  
    }
    if(password!=confirmPassword){
        setError("Mật khẩu bạn nhập lại không khớp");
        toast.error("Đăng ký thất bại");
        return
    }
    const res = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email,password})
      })
      const register = await res.json();
      if(res.status==200){
                  toast.success("Đăng ký tài khoản thành công!")
                  handlerClose();
                  mutate("../../api/user")
                  router.push('http://localhost:3000/auth/SignIn')
      }
      else if(res.status==400){
        toast.error("Đăng ký thất bại");
        setError(register)
      }
  }
    return(
        <>
<div className="flex items-center justify-center min-h-screen bg-[#527360]">
<div className="w-1/2 p-8 bg-white shadow-lg rounded-lg">
<div className="flex justify-center ">
   <button onClick={()=>router.push("/")}> <img src="/upload/logo.png" alt="Sanova Logo" className="h-16 w-auto" /></button>  
    </div>
  <h2 className="text-2xl font-bold text-[#527360] text-center">Đăng ký</h2>
  <form className="mt-4">
    <input 
      type="text" 
      value={name} 
      onChange={(e) => setName(e.target.value)} 
      placeholder="Tên Đăng nhập" 
      className="w-full p-3 border border-[#527360] rounded-lg mb-3 focus:ring-2 focus:ring-[#527360] focus:outline-none"
    />
    <input 
      type="email" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      placeholder="Email" 
      className="w-full p-3 border border-[#527360] rounded-lg mb-3 focus:ring-2 focus:ring-[#527360] focus:outline-none"
    />
    <input 
      type="password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} 
      placeholder="Mật khẩu" 
      className="w-full p-3 border border-[#527360] rounded-lg mb-3 focus:ring-2 focus:ring-[#527360] focus:outline-none"
    />
    <input 
      type="password" 
      value={confirmPassword} 
      onChange={(e) => setConfirmPassword(e.target.value)} 
      placeholder="Nhập lại mật khẩu" 
      className="w-full p-3 border border-[#527360] rounded-lg mb-3 focus:ring-2 focus:ring-[#527360] focus:outline-none"
    />
    {error && <p className="text-center text-red-500 font-bold">{error}</p>}
    <button 
      onClick={handleRegister} 
      className="w-full bg-[#527360] hover:bg-[#415b4e] text-white py-3 rounded-lg font-semibold transition duration-300"
    >
      Đăng ký
    </button>
  </form>
  <div className="text-center mt-4 text-sm">
    <span className="text-gray-600">Bạn đã có tài khoản? </span>
    <Link href="/auth/SignIn" className="text-[#527360] hover:text-[#415b4e] font-semibold">Đăng nhập</Link>
  </div>
</div>
</div>
        </>
    );
}
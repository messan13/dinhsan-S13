import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
export default function changePass(){
    const router = useRouter();
     const [email, setEmail] = useState("");
     const [newpass,setNewPass]= useState("")
     const [confirmPass,setConfirmPass]=useState("");
      useEffect(() => {
         const storedEmail = sessionStorage.getItem("email");
         if (storedEmail) {
           setEmail(storedEmail);
         }
       }, []);
     const hanleChangPass= async (e:React.FormEvent)=>{
        e.preventDefault()
        if(newpass!=confirmPass){
            toast.error("Mật khẩu không khớp!")
            return
        }
        const res = await fetch("http://localhost:3000/api/sendotp/changePassword", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newpass }),
          });
          const data = await res.json();
          if(res.status==200){
            toast.success(data);
            sessionStorage.removeItem("email");
            router.push('http://localhost:3000/auth/SignIn')
          }else if(res.status==400){
            toast.error(data)
          }
     }
    return (
        <div className="flex h-screen bg-[#527360] justify-center items-center">
        <div className="w-1/3 p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-[#527360] text-center">Đổi Mật Khẩu</h2>
        <form className="mt-4">
          <input 
            type="password" 
            value={newpass} 
            onChange={(e) => setNewPass(e.target.value)} 
            placeholder="Mật khẩu mới" 
            className="w-full p-3 border border-[#527360] rounded-lg mb-3 focus:ring-2 focus:ring-[#527360] focus:outline-none"
          />
           <input 
            type="password" 
            value={confirmPass} 
            onChange={(e) => setConfirmPass(e.target.value)} 
            placeholder="Nhập lại mật khẩu" 
            className="w-full p-3 border border-[#527360] rounded-lg mb-3 focus:ring-2 focus:ring-[#527360] focus:outline-none"
          />
          <button 
           onClick={hanleChangPass}
            className="w-full bg-[#527360] hover:bg-[#415b4e] text-white py-3 rounded-lg font-semibold transition duration-300"
          >Đổi mật khẩu</button>
        </form>
     </div>
     </div>
      );
}
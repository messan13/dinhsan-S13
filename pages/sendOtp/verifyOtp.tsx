import { useState,useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
export default function VerifyOTP() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);
  console.log(email);

  const handleVerifyOTP = async () => {
    const res = await fetch("http://localhost:3000/api/sendotp/verifyOtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
   if(res.status==200){
    toast.success(data);
    setOtp("")
    router.push("http://localhost:3000/sendOtp/changPass")
   }else if(res.status==400){
    toast.error(data)
   }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#527360]">
    <div className="w-1/3 p-8 bg-white shadow-lg rounded-lg">
    <h2 className="text-xl font-semibold font-bold text-[#527360] text-center">Xác thực mã OTP</h2>
<p className="text-sm mt-2font-bold text-[#527360] text-center">
  Một mã xác thực gồm 6 số đã được gửi đến <strong>###@gamil.com</strong>
</p>

      <div className="mt-6">
        <input
          type="text"
          value={otp}
          onChange={(e)=>setOtp(e.target.value)}
          maxLength={6}
          placeholder="Mã xác thực"
          className="w-full bg-white text-black text-lg px-4 py-3 rounded-full text-center outline-none"
        />
      </div>

      <button onClick={handleVerifyOTP} className="w-full bg-[#527360] text-white font-semibold text-lg py-3 rounded-full mt-6 hover:bg-[#415b4e]">
        TIẾP TỤC
      </button>
    </div>
  </div>
  );
}

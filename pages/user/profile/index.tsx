import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react';
import useSWR, { Fetcher } from 'swr';
import style from "./UserProfile.module.css";
import React, { useState,useEffect } from 'react';
import {toast } from 'react-toastify';
import {mutate} from 'swr'
const viewDetail = ()=>{
  const [id,setid] = useState<number>(0);
  const [pass,setpass]=useState<string>('')
  const[newpass,setNewpass]=useState('')
  const [confirmpass,setConfirmpass]=useState('')
  const [name, setname] = useState<string>("");
  const [email,setemail]= useState<string >("");
  const [show,setShow]=useState<boolean>(true);
  const [showPass,setShowPass]=useState<boolean>(true)
    const {data:session,status}=useSession();
    const fetcher :Fetcher<Iuser,string> = (url:string) => fetch(url).then(res => res.json())
    const { data, error, isLoading } = useSWR( status==='authenticated' && session?.user.id
      ?  `http://localhost:3000/api/user/${session?.user.id}`:null, fetcher,{
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    })
    useEffect(() => {
      if (data) {
        setid(data.id || 0)
        setname(data.name || ""); 
        setemail(data.email || "");
      }
    }, [data]);
    function validateName(name:any){
      const regex = /^[a-zA-Z][a-zA-Z0-9_]{2,}$/
      return regex.test(name)
    }
    const hanlesubmit=(e: React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      console.log(1);
      if(!name || !email){
        toast.error("Bạn không được bỏ trông mục name hoặc email!")
        return
    }
    if(!validateName(name)){
      toast.error("Tên phải bắt đầu bằng chữ và có 3 ký tự")
      return
    }
    fetch(`http://localhost:3000/api/user/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name,email})
      }).then(res => res.json())
        .then(res => {
            if(res){
              console.log(res);
                toast.success("Lưu thay đổi thành công")
                mutate(status==='authenticated' && session?.user.id
                  ?  `http://localhost:3000/api/user/${session?.user.id}`:null)
            }else{
                toast.error("thêm thất bại")
            }
        });
    }

    const handlerPass= async (e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      if(!pass || !newpass || !confirmpass){
        toast.error("Bạn không được để trống mục!")
        return
      }
      if(newpass!=confirmpass){
        toast.error("mật khẩu nhập lại không khớp!")
        return
      }
      const res = await fetch(status==='authenticated' && session.user.id
        ? `http://localhost:3000/api/user?id=${session?.user.id}` : ""
        ,{
        method:"PUT",
        headers:{
           'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body :JSON.stringify({pass:pass,newpass:newpass})
      })
      
        const up= await res.json();
        console.log(up);
        if(res.status==200){
          setpass("")
          setNewpass("")
          setConfirmpass("")
        return toast.success(up)
        }else{
          return toast.error(up)
        }
      
    }
    return (
        <>
      <div className={style.container}>
      <div className={style.profile_section}>
      <div className="flex items-center justify-center w-16 h-16 bg-gray-500 text-white text-3xl font-bold rounded-full">
        {data?.name?.charAt(0).toUpperCase()}
        </div>

        <p className={style.username}>{data?.email}</p>
      </div>

      <div className={style.info_section}>
        <div className={style.tabs}>
          <button onClick={()=>setShow(true)} className={show ? style.active :''}>Thông tin tài khoản</button>
          <button className={show ? "": style.active } onClick={()=>setShow(false)}>Đổi mật khẩu</button>
        </div>
      {show ? (
         <form className={style.form} onSubmit={hanlesubmit}>
         <label>User:</label>
        <input type="text" placeholder='Tên đăng nhập' onChange={(e)=>setname(e.target.value)} value={name} />

         <label>E-mail:</label>
         <input type="email" value={email} onChange={(e)=>setemail(e.target.value)}  />



         <button  className={style.save_btn}>Lưu thay đổi</button>
       </form>
      ):(
        <form className={style.form} onSubmit={handlerPass}>
        <label>Mật khẩu hiện tại</label>
       <input value={pass} onChange={(e)=>setpass(e.target.value)} type="password" placeholder='Mật khẩu hiện tại' />

        <label>Mật khẩu mới</label>
        <input type="password" placeholder='Mật khẩu mới' value={newpass} onChange={(e)=>setNewpass(e.target.value)} />

        <label>Nhập lại mật khẩu mới</label>
        <input type="password" value={confirmpass} onChange={(e)=>setConfirmpass(e.target.value)} placeholder='Nhập lại mật khẩu'  />

        <button className={style.save_btn}>Đổi mật khẩu</button>
      </form>
      )}
       
      </div>
    </div>
      
        </>
    )
}
export default viewDetail
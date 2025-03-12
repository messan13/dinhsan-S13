import { useState,useEffect } from "react";
import useSWR from "swr";
import {toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { mutate } from "swr";
import { useRouter } from "next/router";
import { format,toZonedTime } from "date-fns-tz";

interface Iproduct{
    idproduct:number
}
const CommentsSection = (prop:Iproduct) => {
    const router = useRouter();
    const {idproduct}=prop;
    const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState<[]>([]);
  const [comment,setComment]=useState('')
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWR(
    `http://localhost:3000/api/comments?idproduct=${idproduct}&&page=${currentPage}&limits=${pageSize}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data) {
      setComments(data.findcoments);  
      setTotalPages(data.totalPage);  
    }
  }, [data]);

  const handlCreatComment = async () =>{
    if(!session){
      router.push('http://localhost:3000/auth/SignIn')
    } else{
      const iduser = session?.user.id
      const data = await fetch('http://localhost:3000/api/comments', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId:iduser,productId:idproduct,content:comment})
    })
    const kq = await data.json();
    if(kq){
      if(data.status==400)
      toast.warning(kq)
    }
    if(data.status==200){
      toast.success(kq)
      setComment("")
      mutate(`http://localhost:3000/api/comments?idproduct=${idproduct}&&page=${currentPage}&limits=${pageSize}`)
    }
    }
}


  const pageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }
    return pages;
  };
   const valiDate =(dateIso:string)=>{
          const vietnamtime= toZonedTime(dateIso,'Asia/Ho_Chi_Minh');
          const formDate = `${format(vietnamtime,'dd/MM/yyyy')} lúc ${format(vietnamtime,'HH:mm')}`
          return formDate;
      }
  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-md rounded-md mt-8">
      <h2 className="text-xl text-[#527360] font-bold mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>
      <div className="p-4 border-2 border-[#527360] rounded-lg w-full max-auto max-w-2xl bg-[#FDF9F6]">

      {/* Ô viết bình luận */}
      <textarea
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#527360] outline-none"
        rows={4}
        placeholder="Viết bình luận của bạn..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <button onClick={handlCreatComment} className="mt-3 px-4 py-2 bg-[#527360] text-white rounded-lg">
        Gửi bình luận
      </button>
    </div>

    {comments.length === 0 ? (
  <p className="text-center text-gray-500 mt-4">Không có bình luận nào,Bạn hãy viết suy nghĩ của mình về sản phẩm</p>
) :(
    <>
     {comments.map((comment:any) => (
       <div key={comment.id} className="mb-6 border-b pb-4 mt-8">
          <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#527360] text-white flex items-center justify-center rounded-full text-xl font-bold">
            {comment?.users.name.charAt(0).toUpperCase()}
          </div>
            <div>
              <p className="font-semibold">{comment.users.email}</p>
              <p className="text-gray-500 text-sm">{valiDate(comment.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 my-2">
            {"★".repeat(comment.rating).split("").map((star, index) => (
              <span key={index} className="text-yellow-500">
                {star}
              </span>
            ))}
          </div>
          <p className="text-gray-700">{comment.content}</p>
          <p className="text-gray-500 text-sm mt-2">👍 {comment.likes}</p>
        </div>
      ))}
      {/* PHÂN TRANG */}
      {comments.length<10 ? (<p></p>) : (
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-300" : "bg-[#527360] text-white"
          }`}
          disabled={currentPage === 1}
        >
         {`<`}
        </button>

        {pageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === page ? "bg-[#527360] text-white" : "bg-white text-[#527360]"
            } ${typeof page === "string" ? "cursor-default" : ""}`}
            disabled={typeof page === "string"}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages ? "bg-gray-300" : "bg-[#527360] text-white"
          }`}
          disabled={currentPage === totalPages}
        >
         {`>`}
        </button>
      </div>
      )}
      </>
    )}
    </div>
  );
};

export default CommentsSection;

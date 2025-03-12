import { NextApiRequest,NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const forbiddenWords = ["địt", "lồn", "buồi"];
export default async function comments(req:NextApiRequest,res:NextApiResponse){
    if(req.method==='POST'){
    try {
        const {productId,content,userId}=req.body
        if(!productId || !content){
            return res.status(400).json("Bạn không được bỏ trống mục!")
        }
        if (forbiddenWords.some((item) => content.toLowerCase().includes(item))) {
            return res.status(400).json( "Bình luận chứa từ ngữ không hợp lệ!" );
        }
        const creat = await prisma.comment.create({
            data:{
                content,
                productId:Number(productId),
                userId:Number(userId)
            }
        })
        if(creat){
            res.status(200).json("Bạn vừa đăng một bình luận!")
        }
    } catch (error) {
        res.status(500).json("Lỗi server khi thêm comments")
    }
    } else if(req.method==='DELETE'){
        try {
            const {idcomments} = req.query
            const {userId} = req.body
            if(!idcomments || !userId){
                return res.status(400).json("Bạn không được bỏ trống mục")
            }
            const checkid = await prisma.comment.findFirst({where:{id:Number(idcomments)}})
            if(!checkid){
               return res.status(400).json("comments không tồn tại!")
            }
            if(Number(userId)!==Number(checkid?.userId)){
              return  res.status(400).json("Bạn không có quyền xóa comments này!")
            }
            const dele = await prisma.comment.delete({where:{id:Number(idcomments)}})
            if(dele){
                return res.status(200).json('Xóa comments thành công')
            }

        } catch (error) {
            res.status(500).json("Lỗi server khi xóa comments")
        }
    } else if(req.method==='GET'){
        try {
          const {idproduct} =req.query
            const {page,limits} = req.query
            const CurrentPage = parseInt(String(page),10)
            const PageSize = parseInt(String(limits),10)
       
       const totalItem = await prisma.comment.count();
       if(page && limits){
        try {
          const findcoments = await prisma.comment.findMany({
            where:{productId:Number(idproduct)},
            skip:(CurrentPage-1)*PageSize,
            take : PageSize,
            orderBy:{
              id:'desc'
            },
            include:{users:true}
          })
          const totalPage = Math.ceil(totalItem/PageSize)
          res.status(200).json({CurrentPage,totalPage,findcoments});
        } catch (error) {
          res.status(500).json("Lỗi server")
        }
       }else{
        try {
          const findcoments = await prisma.comment.findMany({
            where:{productId:Number(idproduct)},
            include:{users:true}
          })
          res.status(200).json(findcoments);
        } catch (error) {
          res.status(500).json("Lỗi server")
        }
      }
        } catch (error) {
            res.status(500).json("Lỗi server khi tải comments")
        }
    }
}
import { NextApiRequest,NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
const prisma = new PrismaClient();
export default async function(req:NextApiRequest,res:NextApiResponse){
    if(req.method==='GET'){
        const {id}=req.query
        try {
            const checkId = await prisma.category.findUnique({
                where:{id:Number(id)}
            })
            if(checkId){
                res.status(200).json(checkId)
            }
        } catch (error) {
            res.status(500).json('lỗi server khi xem chi tiết danh mục')
        }
    } else if(req.method==='PUT'){
        const {id}=req.query
        const {name,type}=req.body
        if(!name || !type){
            return res.status(400).json("bạn không được bỏ trống mục!")
        }
        const slug = slugify(name,{lower:true,strict:true})
        try{
        const Put = await prisma.category.update({
            where:{id:Number(id)},
            data:{name,slug,type}
        })
        if(Put){
            return res.status(200).json("Cập nhật dữ liệu thành công!")
        }
    }catch(err){
        res.status(500).json("lỗi server khi sửa danh mục!")
    }
    } else if(req.method==='DELETE'){
        const {id} = req.query
        try {
            const deletecatogery = await prisma.category.delete({
                where:{id:Number(id)}
            })
            if(deletecatogery){
                res.status(200).json("Xóa sản phẩm thành công!")
            }
        } catch (error) {
            res.status(500).json('Lỗi server khi xóa danh mục')
        }
    }
}
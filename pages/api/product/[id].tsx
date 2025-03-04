import { NextApiRequest , NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import multer from "multer";
import path from "path";
import fs from 'fs'
import { NextApiRequestWithFile } from "@/pages/type/reqfile.d";
 const upload = multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            const UploadDir= path.join(process.cwd(),'/public/upload')
            if(!fs.existsSync(UploadDir)){
                fs.mkdirSync(UploadDir,{recursive:true})
            }
            cb(null,UploadDir)
        },
        filename:(req,file,cb)=>{
                const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9)
                cb(null,`${uniqueSuffix}-${file.originalname}`)
        },
    }),
    limits:{
        fileSize:5*1024*1024
    }
 });

 const uploadMiddlewear = upload.single('image');
 
 function runMiddleware(req: NextApiRequestWithFile, res: NextApiResponse, fn: any) {
   return new Promise((resolve, reject) => {
     fn(req, res, (result: any) => {
       if (result instanceof Error) {
         return reject(result);
       }
       resolve(result);
     });
   });
 }
 export const config = {
   api: {
     bodyParser: false
   }
 }

export default async function product(req:NextApiRequestWithFile, res:NextApiResponse) {
  
    if(req.method==='PUT'){
        const { id } = req.query
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        await runMiddleware(req,res,uploadMiddlewear)
        const {name,description,price} = req.body
        const image = req.file ;
          if(!image){
                const updatepro = await prisma.product.update({
                    where: { id: Number(id) },
                    data:{
                        name,
                        description,
                        price:Number(price),
                    }
                })
                if(updatepro){
                    res.status(200).json("Dữ liệu đã được update")
              }else{
                res.status(400).json({message:"LỖI KHÔNG SỬA ĐC!"})
              }

              }else{
                const findid = await prisma.product.findFirst({
                    where: { id: Number(id) },
                  });
                const imagePath =  path.join(path.basename(path.dirname(image.path)),path.basename(image.path))
        try{
            const updatepro = await prisma.product.update({
                where: { id: Number(id) },
                data:{
                    name,
                    description,
                    price:Number(price),
                    image:imagePath
                }
            })
          if(updatepro){
              if (findid && findid.image) {
                const filepath = path.join(process.cwd(), 'public', findid.image);
                try {
                 fs.unlinkSync(filepath);
                } catch (err) {
                  console.error('Lỗi khi xóa hình ảnh cũ:', err);
                  return res.status(500).json({ message: 'Lỗi khi xóa hình ảnh cũ' });
                }
              }
    
                res.status(200).json("Dữ liệu đã được update")
          }else{
            res.status(400).json({message:"LỖI KHÔNG SỬA ĐC!"})
          }
        }catch(err){
            res.status(500).json("Lỗi server!")
        }}
    }else if(req.method==='DELETE'){
        const {id}= req.query
        const findid = await prisma.product.findFirst({
            where: { id: Number(id) },
          });
          if(!findid){
            return res.status(400).json("không có sản phẩm")
          }
          const orderid = await prisma.orderItem.findFirst({where:{productId:Number(id)}})
          if(orderid){
            return res.status(400).json("Sản phẩm đã được lên đơn bạn không được phép xóa!")
          }
        try{
            const deletepro = await prisma.product.delete({
                where :{id:Number(id)}
            })
            if(deletepro){
                if(findid && findid.image){
                    const filepath= path.join(process.cwd(),'public',findid.image)
                    try{
                        fs.unlinkSync(filepath)
                    }catch(error){
                        console.log("lỗi khi xóa ảnh cũ ", error);
                    }
                }
                res.status(200).json("xóa thành công!")
            }else{
                res.status(400).json("không thể xóa")
            }
        }catch(err){
            res.status(500).json("lỗi server"+err)
        }
    } else if(req.method==='GET'){
        const {id}= req.query
             try{
                const findpro = await prisma.product.findUnique({
                    where :{id:Number(id)}
                })
                if(findpro){
                    res.status(200).json(findpro)
                }else{
                    res.status(400).json("không có data")
                }
                }catch(err){
                    res.status(500).json("lỗi server!")
                }
    }
    
}
import { NextApiRequest,NextApiResponse } from "next";
import multer from "multer";
import path from "path";
import fs, { existsSync } from "fs"
import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { NextApiRequestWithFile } from "@/pages/type/reqfile.d";
import { data } from "react-router-dom";
const prisma = new PrismaClient();
const upload = multer({
  storage : multer.diskStorage({
    destination: (req, file, callback)=> {
        const uploadDir = path.join(process.cwd(),'/public/upload');
        if(!fs.existsSync(uploadDir)){
          fs.mkdirSync(uploadDir,{recursive:true})
        }
        callback(null,uploadDir)
    },
    filename:(req,file,callback)=>{
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9)
        callback(null,`${uniqueSuffix}-${file.originalname}`)
    }
  }),
  limits:{
    fieldSize: 5*1024*1024
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
export default async function index(req:NextApiRequestWithFile,res:NextApiResponse) {
    if(req.method==='POST'){
      await runMiddleware(req,res,uploadMiddlewear)
      const image = req.file;
     const {name,description,price} =req.body
   
      if(!image){
        console.error('No file uploaded.');
        return res.status(400).json({ message: 'Lỗi Tải ảnh! Không có tập tin nào được tải lên' });
      }
        const imagePath =  path.join(path.basename(path.dirname(image.path)),path.basename(image.path))
      try {
        const create = await prisma.product.create({
          data: {
            name,
            description,
            price:Number(price),
            image:imagePath,
            loai:'1'
          }
        });
        res.status(200).json("thêm thành công!");
      } catch (error : any) {
     
        res.status(500).json({ message: 'Lỗi server!', error: error.toString()});
      }
    }else if(req.method==='GET'){
      const {page,limits} = req.query
          const CurrentPage = parseInt(page,10)
          const PageSize = parseInt(limits,10)
     
     const totalItem = await prisma.product.count();
     if(page && limits){
      try {
        const finduser = await prisma.product.findMany({
          skip:(CurrentPage-1)*PageSize,
          take : PageSize,
          orderBy:{
            id:'desc'
          }
        })
        const totalPage = Math.ceil(totalItem/PageSize)
        res.status(200).json({CurrentPage,totalPage,finduser});
      } catch (error) {
        res.status(500).json("Lỗi server")
      }
     }else{
      try {
        const finduser = await prisma.product.findMany()
        res.status(200).json(finduser);
      } catch (error) {
        res.status(500).json("Lỗi server")
      }
    }
    } else{
      res.status(400).json("methord chưa đúng ")
    }
}

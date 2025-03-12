import { NextApiRequest,NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export default async function ProductCatogery(req:NextApiRequest,res:NextApiResponse){
    if(req.method==='GET'){
        const { idproduct } = req.query; 
        if(idproduct){
            try {
                const productCategories = await prisma.productCategory.findMany({
                    where: { productId: Number(idproduct) }, 
                    include: { category: true }, // Lấy thông tin từ bảng category
                  });
                  
                  // Trích xuất danh sách danh mục
                  const categories = productCategories.map(pc => pc.category);
            
                if (!productCategories) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            
                res.status(200).json(categories); 
              } catch (error) {
                res.status(500).json({ message: "Internal Server Error", error });
              }
        }else{
            try {
                const get=await prisma.productCategory.findMany({
                    include:{
                        product:true,
                        category:true
                    }
                })
                res.status(200).json(get)
            } catch (error) {
                res.status(500).json('lỗi server!')
            }
        }
       
    } 
}
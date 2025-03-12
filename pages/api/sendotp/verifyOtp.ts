import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function handlerVerifyOtp(req: NextApiRequest, res: NextApiResponse) {
    if(req.method==='POST'){
        const {email,otp} = req.body
        if(!email || ! otp){
            return res.status(400).json("Bạn không được bỏ trống mục!")
        }
        try{
                const checkotp = await prisma.oTP.findFirst({
                    where :{email,otp,expiresAt:{gt:new Date}}
                })
                if(!checkotp){
                    return res.status(400).json("Mã otp không tồn tại hoặc otp đã hết hạn!")
                }
                await prisma.oTP.update({
                    where: { id:Number(checkotp.id) },
                    data: { isVerified: true },
                  });
                return res.status(200).json("Mã otp của bạn đã được xác nhận thành công!")
        }catch(err){
            res.status(500).json("Lỗi server khi xác thực otp!")
        }
    }
}

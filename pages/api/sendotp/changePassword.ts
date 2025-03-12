import { NextApiRequest,NextApiResponse } from "next";
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export default async function ChangPass(req:NextApiRequest,res:NextApiResponse){
    if(req.method==='PUT'){
        const {email,newpass}=req.body
        if(!newpass){
            return res.status(400).json("Bạn không được để trống mục!")
        }
        if(!email){
            return res.status(400).json("Bạn chưa yêu cầu OTP!" );
        }
        if(newpass.length <8){
            return res.status(400).json("Độ dài mật khẩu phải từ 8 ký tự trở lên!")
        }
        const otpRecord = await prisma.oTP.findFirst({ where: { email } });
        if (!otpRecord) { return res.status(400).json("Bạn chưa yêu cầu OTP" );
    }
        if (!otpRecord.isVerified) return res.status(400).json( "Bạn chưa xác thực OTP!" );
        try {
            const hashPassword = await bcrypt.hash(newpass,10);
            const ChangPass = await prisma.user.update({
                where:{email},
                data:{password:hashPassword}
            })
            if(ChangPass){
                res.status(200).json("Cập nhật mật khẩu thành công!")
                await prisma.oTP.delete({where:{id:Number(otpRecord.id)}})
            }
        } catch (error) {
            res.status(500).json("Lỗi server khi đổi mật khẩu!")
        }
    }
}
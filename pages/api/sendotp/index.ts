import { NextApiRequest,NextApiResponse } from "next";
import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const otpStorage: { [email: string]: { otp: string; expiresAt: number } } = {};
export default async function handlerNodemail(req:NextApiRequest,res:NextApiResponse){
    if(req.method==="POST"){
        const {email} = req.body;
        if (!email) {
            return res.status(400).json( 'Bạn chưa nhập email!');
        }
        const checkemail = await prisma.user.findFirst({where:{email:email}})
        if(!checkemail){
            return res.status(400).json("Email của bạn chưa được dùng để đăng ký tài khoản!")
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 1 phút
         const ObjectDate = new Date(expiresAt)
        await prisma.oTP.create({
            data: { email, otp, expiresAt:ObjectDate },
          });

        otpStorage[email] = { otp, expiresAt };
        const transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:Number(process.env.SMTP_PORT),
            auth :{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            },
        })
        const mailOptions ={
            from :process.env.EMAIL_USER,
            to : email,
            subject:`Xin chào ${checkemail.name}`,
            text :`Bạn vừa yêu cầu mã xác thực OTP để đăng nhập/tạo giao dịch trên Sanova. Vui lòng sử dụng mã dưới đây:  
🔑 **Mã OTP của bạn: "${otp}"**.
Lưu ý:  
- Mã OTP chỉ có hiệu lực trong 1 phút.  
- Không chia sẻ mã này với bất kỳ ai.  
- Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ 0945375009.  
Trân trọng,
Chăm sóc khách hàng sanova
liên hệ hỗ trợ :0945375009
                     `,
        }
        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json( 'gửi mã otp thành công');
        } catch (error) {
            return res.status(500).json( 'Lỗi khi gửi OTP'+ error );
        }
    
    }

}
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Chạy mỗi phút để xóa OTP đã quá 5 phút
cron.schedule("* * * * *", async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // ✅ Đúng 5 phút

  try {
    const deletedCount = await prisma.oTP.deleteMany({
      where: { createdAt: { lt: fiveMinutesAgo } }, // Chỉ xóa OTP quá 5 phút
    });
  } catch (error) {
    console.error("Lỗi khi xóa OTP:", error);
  }
});


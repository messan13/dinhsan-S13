import "../../utils/cron"; // Import để chạy cron job
import { NextApiRequest,NextApiResponse } from "next";
export default function handler(req:NextApiRequest, res:NextApiResponse) {
  res.status(200).json( "Cron job đang chạy!" );
}

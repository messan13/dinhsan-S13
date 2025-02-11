import { NextApiRequest } from 'next';
import multer from 'multer';
export interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

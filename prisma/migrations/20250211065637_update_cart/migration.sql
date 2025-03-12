-- AlterTable
ALTER TABLE `cart` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_idproduct_fkey` FOREIGN KEY (`idproduct`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

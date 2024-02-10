-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "totalPrice" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "isCover" SET DEFAULT false;

-- CreateTable
CREATE TABLE "CartToProduct" (
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productQty" INTEGER NOT NULL,

    CONSTRAINT "CartToProduct_pkey" PRIMARY KEY ("cartId","productId")
);

-- AddForeignKey
ALTER TABLE "CartToProduct" ADD CONSTRAINT "CartToProduct_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartToProduct" ADD CONSTRAINT "CartToProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

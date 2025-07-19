-- DropIndex
DROP INDEX "Order_userId_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "subtitle" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

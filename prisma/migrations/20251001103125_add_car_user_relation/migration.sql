-- AlterTable
ALTER TABLE "public"."Car" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "Car_userId_idx" ON "public"."Car"("userId");

-- AddForeignKey
ALTER TABLE "public"."Car" ADD CONSTRAINT "Car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

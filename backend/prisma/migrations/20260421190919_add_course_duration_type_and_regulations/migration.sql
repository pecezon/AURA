-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('TECHNICAL', 'SECURITY');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'TECHNICAL';

-- CreateTable
CREATE TABLE "Regulation" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Regulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourseToRegulation" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CourseToRegulation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Regulation_name_key" ON "Regulation"("name");

-- CreateIndex
CREATE INDEX "_CourseToRegulation_B_index" ON "_CourseToRegulation"("B");

-- AddForeignKey
ALTER TABLE "_CourseToRegulation" ADD CONSTRAINT "_CourseToRegulation_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToRegulation" ADD CONSTRAINT "_CourseToRegulation_B_fkey" FOREIGN KEY ("B") REFERENCES "Regulation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

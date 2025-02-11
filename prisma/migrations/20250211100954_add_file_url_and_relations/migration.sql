/*
  Warnings:

  - You are about to drop the column `Content` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `_FileToFolder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `url` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FileToFolder" DROP CONSTRAINT "_FileToFolder_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileToFolder" DROP CONSTRAINT "_FileToFolder_B_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "Content",
ADD COLUMN     "folderId" TEXT,
ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "_FileToFolder";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

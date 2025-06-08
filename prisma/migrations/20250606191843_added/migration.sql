-- CreateTable
CREATE TABLE "LogType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LogType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogType_name_key" ON "LogType"("name");

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "LogType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

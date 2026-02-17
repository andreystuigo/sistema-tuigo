-- CreateTable
CREATE TABLE "StockExit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "obra" TEXT,
    "exitDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "StockExit_itemId_idx" ON "StockExit"("itemId");

-- CreateIndex
CREATE INDEX "StockExit_exitDate_idx" ON "StockExit"("exitDate");

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StockExit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "obra" TEXT,
    "exitDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockExit_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "StockItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_StockExit" ("createdAt", "exitDate", "id", "itemId", "notes", "obra", "quantity", "type") SELECT "createdAt", "exitDate", "id", "itemId", "notes", "obra", "quantity", "type" FROM "StockExit";
DROP TABLE "StockExit";
ALTER TABLE "new_StockExit" RENAME TO "StockExit";
CREATE INDEX "StockExit_itemId_idx" ON "StockExit"("itemId");
CREATE INDEX "StockExit_exitDate_idx" ON "StockExit"("exitDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

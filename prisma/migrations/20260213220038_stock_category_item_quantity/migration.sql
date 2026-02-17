-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StockItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "category" TEXT NOT NULL DEFAULT 'NOVO',
    "minQuantity" INTEGER NOT NULL DEFAULT 0,
    "initialQuantity" INTEGER NOT NULL DEFAULT 0,
    "entriesQuantity" INTEGER NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lastEntryAt" DATETIME,
    "location" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StockItem" ("createdAt", "description", "entriesQuantity", "id", "initialQuantity", "lastEntryAt", "location", "minQuantity", "name", "quantity", "sku", "unit", "updatedAt") SELECT "createdAt", "description", "entriesQuantity", "id", "initialQuantity", "lastEntryAt", "location", "minQuantity", "name", "quantity", "sku", "unit", "updatedAt" FROM "StockItem";
DROP TABLE "StockItem";
ALTER TABLE "new_StockItem" RENAME TO "StockItem";
CREATE UNIQUE INDEX "StockItem_sku_key" ON "StockItem"("sku");
CREATE INDEX "StockItem_name_idx" ON "StockItem"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

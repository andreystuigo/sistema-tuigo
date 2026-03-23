-- ToolEquipment: stock-like fields
ALTER TABLE "ToolEquipment" ADD COLUMN "supplierSku" TEXT;
ALTER TABLE "ToolEquipment" ADD COLUMN "manufacturer" TEXT;
ALTER TABLE "ToolEquipment" ADD COLUMN "unit" TEXT;
ALTER TABLE "ToolEquipment" ADD COLUMN "unitPrice" REAL;
ALTER TABLE "ToolEquipment" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'NOVO';
ALTER TABLE "ToolEquipment" ADD COLUMN "minQuantity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ToolEquipment" ADD COLUMN "initialQuantity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ToolEquipment" ADD COLUMN "entriesQuantity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ToolEquipment" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "ToolEquipment" ADD COLUMN "lastEntryAt" DATETIME;
ALTER TABLE "ToolEquipment" ADD COLUMN "location" TEXT NOT NULL DEFAULT 'Tuigo';

-- ToolExit: checkout movements
CREATE TABLE "ToolExit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "toolId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "destination" TEXT,
  "exitDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ToolExit_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ToolEquipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ToolExit_toolId_idx" ON "ToolExit"("toolId");
CREATE INDEX "ToolExit_exitDate_idx" ON "ToolExit"("exitDate");

-- ToolReturn: return movements
CREATE TABLE "ToolReturn" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "toolId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "returnDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ToolReturn_toolId_fkey" FOREIGN KEY ("toolId") REFERENCES "ToolEquipment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "ToolReturn_toolId_idx" ON "ToolReturn"("toolId");
CREATE INDEX "ToolReturn_returnDate_idx" ON "ToolReturn"("returnDate");

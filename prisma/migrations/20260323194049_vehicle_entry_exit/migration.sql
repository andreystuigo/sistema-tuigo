-- CreateTable
CREATE TABLE "VehicleExit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "odometer" INTEGER NOT NULL,
    "destination" TEXT,
    "exitDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VehicleExit_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VehicleEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "odometer" INTEGER NOT NULL,
    "destination" TEXT,
    "entryDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VehicleEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "VehicleExit_vehicleId_idx" ON "VehicleExit"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleExit_exitDate_idx" ON "VehicleExit"("exitDate");

-- CreateIndex
CREATE INDEX "VehicleEntry_vehicleId_idx" ON "VehicleEntry"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleEntry_entryDate_idx" ON "VehicleEntry"("entryDate");

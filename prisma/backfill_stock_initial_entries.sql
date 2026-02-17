-- Backfill existing items after adding initialQuantity/entriesQuantity.
-- Goal: preserve the current total quantity by moving it into initialQuantity.
UPDATE StockItem
SET initialQuantity = quantity,
    entriesQuantity = 0
WHERE (initialQuantity = 0 OR initialQuantity IS NULL)
  AND (entriesQuantity = 0 OR entriesQuantity IS NULL);

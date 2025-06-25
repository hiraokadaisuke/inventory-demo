-- Database schema updates for inventory
-- Ensure inventory table has warehouse_id and quantity columns
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS warehouse_id bigint REFERENCES warehouses(id);
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1;

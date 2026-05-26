-- Sample seed data (password for demo user: Password123!)
-- bcrypt hash generated for 'Password123!'nod

INSERT INTO users (email, password_hash, full_name, role)
VALUES (
  'honorine@zubahouse.com',
  '$2a$10$8K1p/a0dL3LXMIgoEDFrwOfMQcgq3eRPyKpGqJqKqJqKqJqKqJqKqKq',
  'Honorine M.',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Note: Replace password_hash after running scripts/seedAdmin.js which hashes the real password.

INSERT INTO products (name, sku, category, purchase_price, selling_price) VALUES
  ('West African Cocoa — Grade A', 'ZHS-COC-104', 'Commodities', 18.40, 24.90),
  ('Cold-pressed Palm Olein (20L)', 'ZHS-OLE-088', 'Oils & Fats', 42.00, 56.50),
  ('Premium Basmati Rice (25kg)', 'ZHS-RIC-212', 'Grains', 28.75, 36.00),
  ('Sunflower Cooking Oil (5L)', 'ZHS-OIL-031', 'Oils & Fats', 11.20, 15.80),
  ('Granulated Sugar (50kg)', 'ZHS-SUG-017', 'Sweeteners', 32.50, 41.00),
  ('Dried Catfish (Carton)', 'ZHS-FSH-042', 'Protein', 24.00, 31.50),
  ('Tomato Paste (70g × 48)', 'ZHS-TOM-055', 'Packaged Goods', 19.80, 26.40),
  ('Maize Flour (10kg)', 'ZHS-MAZ-019', 'Grains', 8.60, 11.25)
ON CONFLICT (sku) DO NOTHING;

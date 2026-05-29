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


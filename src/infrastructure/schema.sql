CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Seed data (optional)
INSERT INTO users (name, email) VALUES
('User 1', 'user1@example.com'),
('User 2', 'user2@example.com'),
('User 3', 'user3@example.com')
ON CONFLICT (email) DO NOTHING;

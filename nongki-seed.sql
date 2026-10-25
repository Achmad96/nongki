-- Nongki Seed Data
USE nongki;

-- 1. Insert Categories
INSERT INTO kategori (id, nama, deskripsi) VALUES
(1, 'Reguler', 'Regular coworking space with essential facilities'),
(2, 'VIP', 'Premium private space with high-speed internet and complimentary drinks')
ON DUPLICATE KEY UPDATE nama=VALUES(nama);

-- 2. Insert Facilities
INSERT INTO fasilitas (id, jenis) VALUES
(1, 'High-Speed WiFi'),
(2, 'Air Conditioner'),
(3, 'Power Outlet'),
(4, 'Whiteboard'),
(5, 'Free Flow Drink'),
(6, 'Projector')
ON DUPLICATE KEY UPDATE jenis=VALUES(jenis);

-- 3. Insert Spaces
INSERT INTO space (id, id_kategori, jenis, harga) VALUES
('sp-reg-desk-001', 1, 'Desk', 15000),
('sp-reg-group-001', 1, 'Group Desk', 45000),
('sp-reg-meet-001', 1, 'Meeting Room', 100000),
('sp-vip-desk-001', 2, 'Desk', 30000),
('sp-vip-group-001', 2, 'Group Desk', 80000),
('sp-vip-meet-001', 2, 'Meeting Room', 180000)
ON DUPLICATE KEY UPDATE jenis=VALUES(jenis);

-- 4. Insert Space Details (Desk codes corresponding to map layouts)
INSERT INTO detail_space (id_space, kode) VALUES
('sp-reg-desk-001', 'A1'),
('sp-reg-desk-001', 'A2'),
('sp-reg-desk-001', 'A3'),
('sp-reg-desk-001', 'A4'),
('sp-reg-desk-001', 'B1'),
('sp-reg-desk-001', 'B2'),
('sp-reg-desk-001', 'B3'),
('sp-reg-desk-001', 'B4'),
('sp-vip-desk-001', 'C1'),
('sp-vip-desk-001', 'C2'),
('sp-vip-desk-001', 'C3'),
('sp-vip-desk-001', 'C4'),
('sp-vip-desk-001', 'D1'),
('sp-vip-desk-001', 'D2'),
('sp-vip-desk-001', 'D3'),
('sp-vip-desk-001', 'D4'),
('sp-reg-group-001', 'E1'),
('sp-reg-group-001', 'E2'),
('sp-vip-group-001', 'F1'),
('sp-vip-group-001', 'F2'),
('sp-reg-meet-001', 'M1'),
('sp-vip-meet-001', 'M2')
ON DUPLICATE KEY UPDATE id_space=VALUES(id_space);

-- 5. Link Facilities to Spaces
INSERT INTO detail_fasilitas (id_space, id_fasilitas) VALUES
('sp-reg-desk-001', 1),
('sp-reg-desk-001', 2),
('sp-reg-desk-001', 3),
('sp-vip-desk-001', 1),
('sp-vip-desk-001', 2),
('sp-vip-desk-001', 3),
('sp-vip-desk-001', 5),
('sp-vip-meet-001', 1),
('sp-vip-meet-001', 2),
('sp-vip-meet-001', 4),
('sp-vip-meet-001', 5),
('sp-vip-meet-001', 6)
ON DUPLICATE KEY UPDATE id_space=VALUES(id_space);


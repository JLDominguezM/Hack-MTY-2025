-- ============================================
-- SCRIPT COMPLETO: Ejecutar todo en orden
-- ============================================
-- Este script debe ejecutarse en tu base de datos PostgreSQL/Neon
-- Ejecuta cada sección en orden

-- ============================================
-- PASO 1: Insertar balances para usuarios
-- ============================================

INSERT INTO account_balances (user_id, balance) 
VALUES 
  (9, 5000.00),
  (10, 5000.00)
ON CONFLICT (user_id) 
DO UPDATE SET 
  balance = 5000.00,
  updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- PASO 2: Crear tablas de servicios de pago
-- ============================================

-- Tabla: payment_services (Catálogo)
CREATE TABLE IF NOT EXISTS payment_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: user_payment_services (Servicios vinculados)
CREATE TABLE IF NOT EXISTS user_payment_services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES payment_services(id) ON DELETE CASCADE,
    account_number VARCHAR(100) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_service_amount CHECK (amount > 0)
);

-- Tabla: payment_service_transactions (Historial)
CREATE TABLE IF NOT EXISTS payment_service_transactions (
    id SERIAL PRIMARY KEY,
    user_payment_service_id INTEGER NOT NULL REFERENCES user_payment_services(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'balance',
    status VARCHAR(50) DEFAULT 'completed',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_payment_services_active ON payment_services(is_active);
CREATE INDEX IF NOT EXISTS idx_user_payment_services_user_id ON user_payment_services(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_services_status ON user_payment_services(status);
CREATE INDEX IF NOT EXISTS idx_user_payment_services_due_date ON user_payment_services(due_date);
CREATE INDEX IF NOT EXISTS idx_payment_service_transactions_user_id ON payment_service_transactions(user_id);

-- Trigger
CREATE TRIGGER update_user_payment_services_updated_at
    BEFORE UPDATE ON user_payment_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PASO 3: Insertar catálogo de servicios
-- ============================================

INSERT INTO payment_services (name, provider, icon) VALUES
('Luz', 'CFE', 'lightbulb'),
('Gas', 'Gas Natural', 'flame'),
('Agua', 'SACMEX', 'droplet'),
('Internet', 'Telmex', 'wifi'),
('Teléfono', 'Telcel', 'phone'),
('Cable', 'Izzi', 'tv'),
('Teléfono Fijo', 'Telmex', 'phone-outgoing')
ON CONFLICT DO NOTHING;

-- ============================================
-- PASO 4: Vincular servicios a usuarios
-- ============================================

-- Usuario ID 9 (Dani)
INSERT INTO user_payment_services (user_id, service_id, account_number, amount, status, due_date) VALUES
(9, 1, '1234567890', 1250.50, 'pending', '2025-10-28'),
(9, 2, '0987654321', 850.00, 'pending', '2025-10-30'),
(9, 3, '5556667777', 320.75, 'pending', '2025-11-05'),
(9, 4, '4445556666', 599.00, 'pending', '2025-11-01'),
(9, 5, '5551234567', 399.00, 'overdue', '2025-10-26')
ON CONFLICT DO NOTHING;

-- Usuario ID 10 (Hecto Tovar)
INSERT INTO user_payment_services (user_id, service_id, account_number, amount, status, due_date) VALUES
(10, 1, '9876543210', 1150.00, 'pending', '2025-10-29'),
(10, 2, '1231231234', 920.00, 'pending', '2025-11-02'),
(10, 3, '4564564567', 280.50, 'pending', '2025-11-06'),
(10, 4, '7897897890', 649.00, 'pending', '2025-11-03'),
(10, 5, '3213213210', 450.00, 'pending', '2025-10-27')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Ver balances
SELECT 
  u.id,
  u.name,
  u.email,
  ab.balance
FROM users u
JOIN account_balances ab ON u.id = ab.user_id
WHERE u.id IN (9, 10);

-- Ver servicios de usuario 9
SELECT 
    ups.id,
    ps.name,
    ps.provider,
    ups.amount,
    ups.status,
    ups.due_date
FROM user_payment_services ups
JOIN payment_services ps ON ups.service_id = ps.id
WHERE ups.user_id = 9;

-- Ver total pendiente
SELECT 
    user_id,
    COUNT(*) AS servicios_pendientes,
    SUM(amount) AS total_pendiente
FROM user_payment_services
WHERE status IN ('pending', 'overdue')
GROUP BY user_id;

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

-- ============================================
-- SCRIPT SQL: Sistema de Huella Verde y Consumo
-- ============================================

-- Tabla: green_actions
-- Catálogo de acciones verdes que los usuarios pueden realizar
CREATE TABLE IF NOT EXISTS green_actions (
    id SERIAL PRIMARY KEY,
    action_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    points INTEGER NOT NULL, -- Puntos que otorga esta acción
    icon VARCHAR(50),
    category VARCHAR(100), -- 'payment', 'consumption', 'general'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: user_green_achievements
-- Logros verdes obtenidos por usuarios
CREATE TABLE IF NOT EXISTS user_green_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_id INTEGER NOT NULL REFERENCES green_actions(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    related_payment_id INTEGER, -- ID del pago que generó el logro (si aplica)
    metadata JSONB, -- Información adicional del logro
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: user_green_score
-- Puntaje total de huella verde por usuario
CREATE TABLE IF NOT EXISTS user_green_score (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level VARCHAR(50) DEFAULT 'Bronce', -- Bronce, Plata, Oro, Platino
    trees_planted INTEGER DEFAULT 0, -- Árboles equivalentes plantados
    co2_saved NUMERIC(10,2) DEFAULT 0.00, -- KG de CO2 ahorrado
    water_saved NUMERIC(10,2) DEFAULT 0.00, -- Litros de agua ahorrados
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: consumption_history
-- Historial de consumo de servicios por mes
CREATE TABLE IF NOT EXISTS consumption_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL, -- 'luz', 'gas', 'agua', 'internet', 'telefono'
    month INTEGER NOT NULL, -- 1-12
    year INTEGER NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    consumption_value NUMERIC(10,2), -- Consumo en kWh, m³, GB, etc
    vs_previous_month NUMERIC(5,2), -- Porcentaje de cambio vs mes anterior
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, service_type, month, year)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_green_actions_category ON green_actions(category);
CREATE INDEX IF NOT EXISTS idx_user_green_achievements_user_id ON user_green_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_green_score_user_id ON user_green_score(user_id);
CREATE INDEX IF NOT EXISTS idx_consumption_history_user_id ON consumption_history(user_id);
CREATE INDEX IF NOT EXISTS idx_consumption_history_date ON consumption_history(year, month);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_green_score_updated_at
    BEFORE UPDATE ON user_green_score
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS: Catálogo de Acciones Verdes
-- ============================================

INSERT INTO green_actions (action_code, name, description, points, icon, category) VALUES
-- Acciones de pago anticipado
('PAY_WATER_EARLY', 'Pago Anticipado de Agua', 'Pagaste tu servicio de agua antes de la fecha de vencimiento', 50, '💧', 'payment'),
('PAY_LIGHT_EARLY', 'Pago Anticipado de Luz', 'Pagaste tu servicio de luz antes de la fecha de vencimiento', 50, '💡', 'payment'),
('PAY_GAS_EARLY', 'Pago Anticipado de Gas', 'Pagaste tu servicio de gas antes de la fecha de vencimiento', 50, '🔥', 'payment'),

-- Acciones de consumo eficiente
('LOW_WATER_CONSUMPTION', 'Consumo Eficiente de Agua', 'Redujiste tu consumo de agua en más del 10% este mes', 100, '💦', 'consumption'),
('LOW_ENERGY_CONSUMPTION', 'Ahorro de Energía', 'Redujiste tu consumo eléctrico en más del 10% este mes', 100, '⚡', 'consumption'),
('LOW_GAS_CONSUMPTION', 'Uso Eficiente de Gas', 'Redujiste tu consumo de gas en más del 10% este mes', 100, '🔥', 'consumption'),

-- Acciones generales
('PAY_ALL_SERVICES', 'Pago Total de Servicios', 'Pagaste todos tus servicios del mes', 150, '✅', 'payment'),
('ZERO_DELAY', 'Cero Retrasos', 'No tuviste servicios vencidos este mes', 75, '⏰', 'payment'),
('CONSECUTIVE_PAYMENTS', 'Puntualidad Constante', 'Pagaste a tiempo por 3 meses consecutivos', 200, '🏆', 'payment')
ON CONFLICT (action_code) DO NOTHING;

-- ============================================
-- DATOS: Historial de Consumo (Últimos 6 meses)
-- ============================================

-- Usuario ID 9 (Dani) - Consumo decreciente (buen comportamiento)
INSERT INTO consumption_history (user_id, service_type, month, year, amount, consumption_value, vs_previous_month) VALUES
-- Luz
(9, 'luz', 5, 2025, 1450.00, 350.5, 0),
(9, 'luz', 6, 2025, 1380.00, 332.8, -5.05),
(9, 'luz', 7, 2025, 1310.00, 315.2, -5.31),
(9, 'luz', 8, 2025, 1280.00, 308.1, -2.29),
(9, 'luz', 9, 2025, 1250.50, 301.0, -2.30),
(9, 'luz', 10, 2025, 1200.00, 288.9, -4.04),

-- Agua
(9, 'agua', 5, 2025, 420.00, 45.2, 0),
(9, 'agua', 6, 2025, 390.00, 42.0, -7.14),
(9, 'agua', 7, 2025, 365.00, 39.3, -6.41),
(9, 'agua', 8, 2025, 340.00, 36.6, -6.85),
(9, 'agua', 9, 2025, 320.75, 34.5, -5.66),
(9, 'agua', 10, 2025, 295.00, 31.8, -8.03),

-- Gas
(9, 'gas', 5, 2025, 950.00, 85.5, 0),
(9, 'gas', 6, 2025, 920.00, 82.8, -3.16),
(9, 'gas', 7, 2025, 890.00, 80.1, -3.26),
(9, 'gas', 8, 2025, 870.00, 78.3, -2.25),
(9, 'gas', 9, 2025, 850.00, 76.5, -2.30),
(9, 'gas', 10, 2025, 820.00, 73.8, -3.53)
ON CONFLICT (user_id, service_type, month, year) DO NOTHING;

-- Usuario ID 10 (Hecto) - Consumo variable
INSERT INTO consumption_history (user_id, service_type, month, year, amount, consumption_value, vs_previous_month) VALUES
-- Luz
(10, 'luz', 5, 2025, 1100.00, 265.0, 0),
(10, 'luz', 6, 2025, 1150.00, 277.0, 4.55),
(10, 'luz', 7, 2025, 1120.00, 269.8, -2.61),
(10, 'luz', 8, 2025, 1180.00, 284.3, 5.36),
(10, 'luz', 9, 2025, 1150.00, 277.0, -2.54),
(10, 'luz', 10, 2025, 1100.00, 265.0, -4.35),

-- Agua
(10, 'agua', 5, 2025, 310.00, 33.4, 0),
(10, 'agua', 6, 2025, 295.00, 31.8, -4.84),
(10, 'agua', 7, 2025, 305.00, 32.8, 3.39),
(10, 'agua', 8, 2025, 290.00, 31.2, -4.92),
(10, 'agua', 9, 2025, 280.50, 30.2, -3.28),
(10, 'agua', 10, 2025, 275.00, 29.6, -1.96),

-- Gas
(10, 'gas', 5, 2025, 980.00, 88.2, 0),
(10, 'gas', 6, 2025, 950.00, 85.5, -3.06),
(10, 'gas', 7, 2025, 940.00, 84.6, -1.05),
(10, 'gas', 8, 2025, 930.00, 83.7, -1.06),
(10, 'gas', 9, 2025, 920.00, 82.8, -1.08),
(10, 'gas', 10, 2025, 900.00, 81.0, -2.17)
ON CONFLICT (user_id, service_type, month, year) DO NOTHING;

-- ============================================
-- DATOS: Inicializar puntajes de usuarios
-- ============================================

INSERT INTO user_green_score (user_id, total_points, level, trees_planted, co2_saved, water_saved) VALUES
(9, 0, 'Bronce', 0, 0.00, 0.00),
(10, 0, 'Bronce', 0, 0.00, 0.00)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- CONSULTAS DE VERIFICACIÓN
-- ============================================

-- Ver historial de consumo
SELECT * FROM consumption_history WHERE user_id = 9 ORDER BY year DESC, month DESC;

-- Ver puntaje verde
SELECT * FROM user_green_score WHERE user_id = 9;

-- Ver acciones verdes disponibles
SELECT * FROM green_actions WHERE is_active = TRUE ORDER BY category, points DESC;

-- Crear tabla de invitados
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  access_code VARCHAR(50) UNIQUE NOT NULL,
  max_plus_ones INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de confirmaciones
CREATE TABLE confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  will_attend BOOLEAN NOT NULL,
  dietary_restrictions TEXT,
  menu_preference VARCHAR(20) CHECK (menu_preference IN ('meat', 'fish', 'vegetarian')),
  special_requests TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guest_id)
);

-- Crear tabla de acompañantes
CREATE TABLE plus_ones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_id UUID REFERENCES confirmations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  dietary_restrictions TEXT,
  menu_preference VARCHAR(20) CHECK (menu_preference IN ('meat', 'fish', 'vegetarian')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plus_ones ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para guests
CREATE POLICY "Guests can view their own data" ON guests
  FOR SELECT USING (auth.uid()::text = access_code OR auth.role() = 'service_role');

CREATE POLICY "Guests can update their own data" ON guests
  FOR UPDATE USING (auth.uid()::text = access_code OR auth.role() = 'service_role');

CREATE POLICY "Allow public read access to guests" ON guests
  FOR SELECT USING (true);

-- Políticas de seguridad para confirmations
CREATE POLICY "Users can view confirmations" ON confirmations
  FOR SELECT USING (true);

CREATE POLICY "Users can insert confirmations" ON confirmations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update confirmations" ON confirmations
  FOR UPDATE USING (true);

-- Políticas de seguridad para plus_ones
CREATE POLICY "Users can view plus_ones" ON plus_ones
  FOR SELECT USING (true);

CREATE POLICY "Users can insert plus_ones" ON plus_ones
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update plus_ones" ON plus_ones
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete plus_ones" ON plus_ones
  FOR DELETE USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_confirmations_updated_at BEFORE UPDATE ON confirmations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plus_ones_updated_at BEFORE UPDATE ON plus_ones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO guests (name, email, phone, access_code, max_plus_ones) VALUES
('María García', 'maria@example.com', '+34 600 123 456', 'MARIA2024', 2),
('Juan Pérez', 'juan@example.com', '+34 600 789 012', 'JUAN2024', 1),
('Ana López', 'ana@example.com', '+34 600 345 678', 'ANA2024', 0),
('Carlos Ruiz', 'carlos@example.com', '+34 600 901 234', 'CARLOS2024', 3),
('Laura Martín', 'laura@example.com', '+34 600 567 890', 'LAURA2024', 1);
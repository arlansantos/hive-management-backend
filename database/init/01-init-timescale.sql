-- Inicialização do TimescaleDB para Hive Management System

-- Criar extensão TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Criar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurações iniciais do banco
ALTER DATABASE hive_management SET timezone TO 'UTC';

-- Log de inicialização
DO $$
BEGIN
    RAISE NOTICE 'TimescaleDB initialization completed successfully!';
    RAISE NOTICE 'Database: hive_management';
    RAISE NOTICE 'Timezone: UTC';
    RAISE NOTICE 'Extensions: timescaledb, uuid-ossp';
END $$;

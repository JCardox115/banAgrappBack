-- Crear tabla grupos_labor
CREATE TABLE IF NOT EXISTS grupos_labor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    fincaId INT,
    activo BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (fincaId) REFERENCES fincas(id)
);

-- Crear tabla detalles_labor
CREATE TABLE IF NOT EXISTS detalles_labor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    variable VARCHAR(255) NOT NULL,
    laborId INT,
    unidadMedidaId INT,
    laborPrincipal BOOLEAN DEFAULT FALSE,
    precio DECIMAL(10, 2) NOT NULL,
    lugarEjecucionId INT,
    activo BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (laborId) REFERENCES labores(id),
    FOREIGN KEY (unidadMedidaId) REFERENCES unidad_medida(id),
    FOREIGN KEY (lugarEjecucionId) REFERENCES lugar_ejecucion(id)
);

-- Modificar la tabla labores
ALTER TABLE labores
ADD COLUMN codigo VARCHAR(255) DEFAULT NULL,
ADD COLUMN grupoLaborId INT NULL,
ADD FOREIGN KEY (grupoLaborId) REFERENCES grupos_labor(id);

-- Modificar la tabla labores_finca
ALTER TABLE labores_finca
DROP COLUMN codigo,
CHANGE COLUMN precioEspecifico precio DECIMAL(10, 2);

-- Migración de datos
-- Este paso debe ser ejecutado manualmente después de crear las tablas
-- y modificar la estructura 
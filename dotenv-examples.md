# Ejemplos de configuración para diferentes entornos

Este documento contiene ejemplos de archivos `.env` para los diferentes entornos de la aplicación. Debes crear cada archivo en la raíz del proyecto con su respectivo contenido.

## Archivo base (.env)

Este archivo contiene configuraciones comunes para todos los entornos:

```
# Variables comunes para todos los entornos
TZ=America/Guayaquil
TYPEORM_SYNCHRONIZE=false
TYPEORM_MIGRATIONS_RUN=true
TYPEORM_ENTITIES=dist/**/*.entity.js
TYPEORM_MIGRATIONS=dist/migrations/*.js
```

## Entorno de Desarrollo (.env.development)

```
# Configuración para ENTORNO DE DESARROLLO
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=dev_password
DB_DATABASE=bananera_dev

# JWT
JWT_SECRET=desarrollo_secreto_key_2024
JWT_EXPIRES_IN=1d

# Aplicación
PORT=3000
API_PREFIX=api
CORS_ORIGIN=http://localhost:4200
```

## Entorno de Pruebas UAT (.env.uat)

```
# Configuración para ENTORNO DE PRUEBAS (UAT)
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=uat_password
DB_DATABASE=bananera_uat

# JWT
JWT_SECRET=uat_secreto_key_2024
JWT_EXPIRES_IN=12h

# Aplicación
PORT=3000
API_PREFIX=api
CORS_ORIGIN=https://uat.reporte-labores.com
```

## Entorno de Producción (.env.production)

```
# Configuración para ENTORNO DE PRODUCCIÓN
# Base de datos
DB_HOST=db.servidor-produccion.com
DB_PORT=5432
DB_USERNAME=postgres_prod
DB_PASSWORD=prod_password_muy_segura
DB_DATABASE=bananera_prod

# JWT
JWT_SECRET=produccion_secreto_key_muy_seguro_2024
JWT_EXPIRES_IN=8h

# Aplicación
PORT=3000
API_PREFIX=api
CORS_ORIGIN=https://reporte-labores.com
```

## Archivo de configuración local (.env.local)

Este archivo contiene configuraciones específicas para tu entorno local y no debe incluirse en el control de versiones:

```
# Variables específicas para tu entorno local (no incluir en control de versiones)
# Puedes sobrescribir cualquier variable de los otros archivos .env

# Ejemplos:
# DB_PASSWORD=mi_password_local
# PORT=3001
```

## Instrucciones

1. Crea cada uno de estos archivos en la raíz del proyecto
2. Ajusta los valores según las necesidades específicas de tu entorno
3. Nunca subas los archivos con contraseñas reales al control de versiones
4. Para ejecutar en un entorno específico, usa los scripts definidos en package.json:

```bash
# Para desarrollo
npm run start:dev

# Para UAT
npm run deploy:uat

# Para producción
npm run deploy:prod
``` 
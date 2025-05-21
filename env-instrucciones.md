# Instrucciones para configuración de archivos .env

Este proyecto necesita archivos `.env` específicos para cada entorno. Debido a restricciones de seguridad, hemos proporcionado plantillas en archivos `.txt`.

## 1. Pasos para configurar los archivos de entorno

### Para entorno base (común a todos los ambientes)
1. Copiar el contenido de `env-base.txt` 
2. Crear un archivo nuevo llamado `.env` (sin extensión txt)
3. Pegar el contenido y ajustar los valores según sea necesario

### Para entorno de desarrollo
1. Copiar el contenido de `env-development.txt` 
2. Crear un archivo nuevo llamado `.env.development` (sin extensión txt)
3. Pegar el contenido y ajustar los valores según sea necesario

### Para entorno UAT
1. Copiar el contenido de `env-uat.txt` 
2. Crear un archivo nuevo llamado `.env.uat` (sin extensión txt)
3. Pegar el contenido y ajustar los valores según sea necesario

### Para entorno de producción
1. Copiar el contenido de `env-production.txt` 
2. Crear un archivo nuevo llamado `.env.production` (sin extensión txt)
3. Pegar el contenido y ajustar los valores según sea necesario

### Para configuración local (opcional)
1. Copiar el contenido de `env-local-ejemplo.txt` 
2. Crear un archivo nuevo llamado `.env.local` (sin extensión txt)
3. Personalizar los valores según tu entorno local

## 2. Importante sobre seguridad

- Los archivos `.env*` (excepto los ejemplos) están en `.gitignore` y NUNCA deben subirse al repositorio
- Utiliza contraseñas seguras en producción y UAT
- No compartas los archivos `.env` con credenciales reales
- Para desarrollo en equipo, cada desarrollador debe tener sus propios archivos `.env.local`

## 3. Cómo ejecutar con el entorno adecuado

Para cada entorno, ya hemos configurado scripts en `package.json`:

```bash
# Desarrollo
npm run start:dev

# UAT
npm run deploy:uat

# Producción
npm run deploy:prod
```

## 4. Verificación de carga de archivos

Al iniciar la aplicación, en los logs verás qué archivos `.env` se cargaron correctamente. 
Deberías ver algo como:

```
Archivos de configuración cargados: .env, .env.development
``` 
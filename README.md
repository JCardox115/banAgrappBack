# Sistema de Gestión de Labores Agrícolas - Backend

Backend para el sistema de gestión de nómina y labores agrícolas.

## Requisitos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- NPM (v7 o superior)

## Entornos disponibles

El sistema puede ejecutarse en tres entornos diferentes:

1. **Desarrollo (development)** - Para desarrollo local
2. **UAT (User Acceptance Testing)** - Para pruebas de aceptación
3. **Producción (production)** - Para el entorno de producción

## Configuración de entorno

La aplicación utiliza diferentes archivos de configuración según el ambiente. Para cada entorno, debes crear el archivo correspondiente:

- `.env` - Variables comunes para todos los entornos
- `.env.development` - Variables específicas de desarrollo (cuando NODE_ENV=development)
- `.env.uat` - Variables específicas de UAT (cuando NODE_ENV=uat)
- `.env.production` - Variables específicas de producción (cuando NODE_ENV=production)
- `.env.local` - Variables locales que no se deben compartir en control de versiones

Ejemplo de contenido para los archivos `.env`:

```
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=nombre_base_datos

# JWT
JWT_SECRET=clave_secreta_muy_segura
JWT_EXPIRES_IN=1d

# Aplicación
PORT=3000
API_PREFIX=api
CORS_ORIGIN=http://localhost:4200

# Otros
NODE_ENV=development  # Ajustar según el archivo específico
```

Para **producción**, asegúrate de usar valores seguros:

```
# En .env.production
DB_DATABASE=bananera_prod
JWT_SECRET=clave_muy_segura_y_compleja_para_produccion
CORS_ORIGIN=https://tu-dominio-produccion.com
NODE_ENV=production
```

## Instalación

```bash
# Instalar dependencias
npm install
```

## Scripts disponibles

### Desarrollo

```bash
# Ejecutar en modo desarrollo (con recarga automática)
npm run start:dev

# Ejecutar en modo debug
npm run start:debug
```

### UAT

```bash
# Compilar para UAT
npm run build

# Ejecutar en entorno UAT
npm run start:uat

# Desplegar en UAT (compilar y ejecutar)
npm run deploy:uat
```

### Producción

```bash
# Compilar para producción (optimizado)
npm run build:prod

# Ejecutar en modo producción
npm run start:prod

# Desplegar en producción (compilar y ejecutar)
npm run deploy:prod
```

## Seguridad y configuraciones adicionales

En los entornos de UAT y producción, se activan automáticamente:

1. **Helmet** - Protección para cabeceras HTTP
2. **Compression** - Compresión de respuestas
3. **Rate Limiting** - Límite de solicitudes por IP
4. **Logging reducido** - Solo logs esenciales

## Bases de datos recomendadas por entorno

- **Desarrollo**: `bananera_dev`
- **UAT**: `bananera_uat`
- **Producción**: `bananera_prod`

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

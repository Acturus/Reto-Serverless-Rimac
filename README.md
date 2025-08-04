<!--
title: 'Serverless Framework Node Express API service backed by DynamoDB on AWS'
description: 'This template demonstrates how to develop and deploy a simple Node Express API service backed by DynamoDB running on AWS Lambda using the Serverless Framework.'
layout: Doc
framework: v4
platform: AWS
language: nodeJS
priority: 1
-->

# 🩺 Appointment System – Backend Serverless

Solución moderna y completa para el **agendamiento de citas médicas**, construida sobre **AWS Lambda + Serverless Framework**, siguiendo arquitectura limpia y con tests unitarios en todos los módulos clave.

---

## 🚀 **Demo & URLs**

- **Aplicación web:**  
  [appointment-static-site.s3-website-us-east-1.amazonaws.com](http://appointment-static-site.s3-website-us-east-1.amazonaws.com/)

- **Documentación Swagger:**  
  [swag-appointment-system-site.s3-website-us-east-1.amazonaws.com](http://swag-appointment-system-site.s3-website-us-east-1.amazonaws.com/)

- **Consulta de citas (por código de asegurado):**  
  [`GET /appointment/insured/{insuredId}`](https://9knrfdquid.execute-api.us-east-1.amazonaws.com/appointment/insured/00002)  
  _(ejemplo con código "00002")_

---

## 🆕 **Lambdas principales**

### 1. **APPOINTMENT**  
Gestiona la creación y consulta de citas médicas.

### 2. **CATALOG**  
Lambda adicional encargado de alimentar la base de catálogos (centros médicos, médicos, especialidades, pacientes), utilizada por la app web para poblar los combos y validar datos de negocio.

---

## ⚙️ **Variables de entorno esenciales**

Utiliza el archivo `.env.example` como base para configurar tu entorno local o nube.  
**Importante:** No compartas tus credenciales reales.

```env
AWS_REGION=us-east-1
CATALOGS_TABLE=catalogs
APPOINTMENTS_TABLE=appointments
MYSQL_PE_HOST="mysqlpe.us-east-1.rds.amazonaws.com"
MYSQL_PE_USER=admin
MYSQL_PE_PASS=123456
MYSQL_PE_DB=medical_system
MYSQL_CL_HOST="mysqlcl.us-east-1.rds.amazonaws.com"
MYSQL_CL_USER=admin
MYSQL_CL_PASS=123456
MYSQL_CL_DB=medical_system
EVENTS_BUS_NAME=appointments-events

# S3 SITES BUCKETS NAME
WEBAPP_BUCKET=webp-s3-bucket-name
SWAGGER_BUCKET=swag-s3-bucket-name

# (LAMBDA_TIMEOUT - DELAY_SECONDS) >= 2, caso contrario no se aplicará el timeout
STATE_UPDATE_DELAY_SECONDS=7
STATE_UPDATE_LAMBDA_TIMEOUT=9
```

> **Nota:**  
> El control del delay y timeout permite simular el flujo de estados `pending` y `completed` de las citas, emulando un sistema distribuido realista.

## 📦 **Scripts útiles (`package.json`)**

```json
"scripts": {
  "seed:catalog": "ts-node src/catalog/infrastructure/db/seeders/runSeeders.ts",
  "deploy:seed": "serverless deploy && npm run seed:catalog",
  "set:apiurl": "node cmd/set-api-url.js",
  "deploy:static": "npm run set:apiurl && serverless client deploy",
  "deploy:swagger": "npm run set:apiurl && serverless client deploy --config serverless-swagger.yml",
  "deploy:sites": "npm run deploy:swagger && serverless client deploy",
  "deploy:full": "npm run deploy:seed && npm run deploy:sites",
  "deploy:clear": "serverless remove",
  "test": "npx jest"
}
```

- **`set:apiurl`**: Script que obtiene automáticamente la URL actual del API Gateway y la actualiza donde sea necesario, facilitando despliegues de frontend y Swagger sin pasos manuales.
- **`seed:catalog`**: Permite poblar la tabla de catálogos para pruebas y ambientes nuevos.
- **`test`**: Corre todos los tests unitarios (Jest + TypeScript).

---

## 🛠️ **Tecnologías y herramientas**

- **Node.js:** 20.x
- **TypeScript:** ^5.x
- **Serverless Framework:** v4.x
- **Jest:** ^29.x (tests unitarios en todos los casos de uso, repos y helpers)
- **AWS:** Lambda, API Gateway, S3 (static site hosting), DynamoDB, SNS, SQS, EventBridge, RDS (MySQL)
- **Infraestructura como código:** Todo definido en archivos `serverless.yml` (principal y para Swagger/frontend)
- **Plugins utilizados:**
  - `serverless-finch` (deploy de sitios estáticos y Swagger)
  - `serverless-openapi-documenter` (documentación OpenAPI/Swagger)

---

## 🚀 **Despliegue rápido**

> **Antes de comenzar:**  
> Asegúrate de tener **AWS CLI configurado** y **Serverless Framework instalado globalmente** en tu entorno de Node.js.

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Copia el archivo `.env.example` a `.env` y ajusta tus variables según tu entorno.
3. Despliega toda la solución:
   ```bash
   npm run deploy:full
   ```
4. Accede a la aplicación web y al swagger desde los enlaces que obtendrás en consola.

---

## 📝 **Endpoints principales**

- Consulta todos los endpoints en el Swagger publicado.
- **Ejemplo rápido:**  
  - `POST /appointment` → Agendar nueva cita  
  - `GET /appointment/insured/{insuredId}` → Consultar citas por asegurado  
  - `GET /catalog/medical-centers/{insuredId}` → Centros médicos por asegurado  
  - Otros: doctores, especialidades, etc.

---

## 💡 **Notas y recomendaciones**

- El sistema simula el ciclo de vida completo de una cita (`pending` → `completed`) usando delays y timeouts configurables.
- Todo es fácilmente extendible para ambientes productivos o de demo.
- El código es modular, desacoplado, fácil de entender y cubierto por tests unitarios.
- Para pruebas automáticas y despliegues CI/CD, todas las dependencias externas son mockeadas en los tests.

---

## 🌅 **¡Gracias por revisar este proyecto!**  
Estoy disponible para cualquier consulta, retroalimentación o duda técnica que surja.  
Puedes contactarme sin problema, ¡estaré encantado de conversar sobre la solución, arquitectura o posibles mejoras!

[🔗 Conectar en LinkedIn](https://www.linkedin.com/in/artacuri/)

---

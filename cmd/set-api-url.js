const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ejecuta serverless info y redirige la salida a un archivo temporal
execSync('npx serverless info --verbose > temp-output.txt 2>&1', { shell: true });

// Lee la salida completa desde el archivo temporal
const output = fs.readFileSync('temp-output.txt', 'utf8');

// Busca la línea que contiene HttpApiUrl
const httpApiUrlLine = output.split('\n').find(line => line.includes('HttpApiUrl'));
if (!httpApiUrlLine) {
  console.error("ERROR: No se encuentra la URL del API Gateway, debe realizar el primer deploy");
  process.exit(1);
}

// Extrae la URL usando regex
const match = httpApiUrlLine.match(/https:\/\/[a-zA-Z0-9.-]+\.execute-api\.[a-z0-9-]+\.amazonaws\.com/);
if (!match) {
  console.error("ERROR: Error de lectura, asegúrese de no haber modificado este script");
  process.exit(1);
}
const apiUrl = match[0];

console.log("API Gateway URL detectada: ", apiUrl);

// Lee el archivo JS
const jsPath = path.join(__dirname, '..', 'static', 'js', 'script.js');
let js = fs.readFileSync(jsPath, 'utf8');

const openApiPath = path.join(__dirname, '..', 'openapi', 'generated', 'openapi.json');
let openApiJson = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));

// Reemplaza la línea de la constante API_BASE_URL
js = js.replace(
  /const\s+API_BASE_URL\s*=\s*(["'])[^'"]*\1\s*;/,
  `const API_BASE_URL = "${apiUrl}";`
);

// Coloca la url correcta del API Gateway en el json del Swagger
openApiJson.servers = [
  {
    url: apiUrl
  }
];

// Guarda los archivos
fs.writeFileSync(jsPath, js, 'utf8');
console.log("URL de API actualizada en la aplicación web");

fs.writeFileSync(openApiPath, JSON.stringify(openApiJson, null, 2));
console.log("URL de API actualizada en el swagger");

// Limpiar el archivo temporal
fs.unlinkSync('temp-output.txt');

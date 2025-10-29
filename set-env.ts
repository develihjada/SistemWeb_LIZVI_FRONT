const { writeFileSync } = require('fs');

const setEnv = () => {
  // Debug: Mostrar variables de entorno disponibles
  console.log('🔍 Variables de entorno disponibles:');
  console.log('API_URL:', process.env['API_URL'] || 'NO DEFINIDA');
  console.log('PRODUCTION:', process.env['PRODUCTION'] || 'NO DEFINIDA');

  // Configuración para producción
  const apiUrl = process.env['API_URL'] || 'https://api.tudominio.com';
  console.log('📡 URL del API que se usará:', apiUrl);

  const prodTargetPath = './src/environments/environment.ts';
  const prodEnvConfigFile = `export const environment = {
  production: true,
  api: '${apiUrl}',
};
`;

  // Configuración para desarrollo (opcional, si necesitas sobreescribir)
  const devTargetPath = './src/environments/environment.development.ts';
  const devEnvConfigFile = `export const environment = {
  production: false,
  api: '${process.env['DEV_API_URL'] || 'http://192.168.50.40:8085'}',
};
`;

  try {
    writeFileSync(prodTargetPath, prodEnvConfigFile);
    console.log('✅ Archivo environment.ts generado correctamente');

    if (process.env['GENERATE_DEV']) {
      writeFileSync(devTargetPath, devEnvConfigFile);
      console.log('✅ Archivo environment.development.ts generado correctamente');
    }
  } catch (error) {
    console.error('❌ Error al generar archivos de environment:', error);
    process.exit(1);
  }
};

// Ejecutar la función
setEnv();

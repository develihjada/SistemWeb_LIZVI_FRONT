const { writeFileSync } = require('fs');

const setEnv = () => {
  // Configuración para producción
  const prodTargetPath = './src/environments/environment.ts';
  const prodEnvConfigFile = `export const environment = {
  production: true,
  api: '${process.env['API_URL'] || 'https://api.tudominio.com'}',
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
    if (process.env['GENERATE_DEV']) {
      writeFileSync(devTargetPath, devEnvConfigFile);
    }
  } catch (error) {
    process.exit(1);
  }
};

// Ejecutar la función
setEnv();

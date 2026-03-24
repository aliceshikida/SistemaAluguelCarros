const app = require('./app');
const env = require('./config/env');
const initDatabase = require('./utils/initDatabase');

async function bootstrap() {
  await initDatabase();
  app.listen(env.port, () => {
    console.log(`Servidor rodando em http://localhost:${env.port}`);
  });
}

bootstrap();

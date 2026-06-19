import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './db/mongoose.js';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`${env.port}번 포트에서 서버가 실행 중입니다.`);
  });

  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`${signal} 신호를 받아 서버를 종료합니다.`);
    server.close(() => {
      void disconnectDatabase().finally(() => {
        process.exit(0);
      });
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  process.on('unhandledRejection', (reason) => {
    console.error('처리되지 않은 Promise 거부가 발생했습니다.', reason);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer().catch((error) => {
  console.error('서버 시작에 실패했습니다.', error);
  process.exit(1);
});

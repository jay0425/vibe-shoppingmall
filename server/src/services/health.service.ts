import mongoose from 'mongoose';

type HealthStatus = {
  status: '정상';
  database: '연결됨' | '연결 안 됨';
  uptime: number;
  timestamp: string;
};

export const getHealthStatus = (): HealthStatus => ({
  status: '정상',
  database:
    mongoose.connection.readyState === mongoose.ConnectionStates.connected
      ? '연결됨'
      : '연결 안 됨',
  uptime: process.uptime(),
  timestamp: new Date().toISOString(),
});

import mongoose from 'mongoose';

import { env } from '../config/env.js';

export const connectDatabase = async (): Promise<void> => {
  mongoose.set('strictQuery', true);

  await mongoose.connect(env.mongoUri);
  console.log('MongoDB에 연결되었습니다.');
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log('MongoDB 연결이 종료되었습니다.');
};

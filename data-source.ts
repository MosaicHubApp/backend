import { DataSource } from 'typeorm';
import ormConfig from './src/typeorm.config';

export const AppDataSource = new DataSource(ormConfig);

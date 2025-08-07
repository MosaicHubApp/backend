import { DataSource } from 'typeorm';
import ormConfig from './src/typeorm.config';

console.log("🟢 DATA SOURCE INIT");
export const AppDataSource = new DataSource(ormConfig);

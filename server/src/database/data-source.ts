import { config } from "dotenv";
config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "./entity/Employee";
import { Otp } from "./entity/Otp";
import { User } from "./entity/User";
import { Asset } from "./entity/Asset";



export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Otp, Employee, Asset],
  migrations: [],
  subscribers: [],
});

export const userRepository = AppDataSource.getRepository(User);
export const assetRepository = AppDataSource.getRepository(Asset);
export const employeeRepository = AppDataSource.getRepository(Employee);
export const otpRepository = AppDataSource.getRepository(Otp);

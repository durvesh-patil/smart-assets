import {
  userRepository,
  employeeRepository,
  assetRepository,
  AppDataSource,
} from "../database/data-source";

import { User } from "../database/entity/User"; // Import User entity
import { Employee } from "../database/entity/Employee"; // Import Employee entity
import { Asset } from "../database/entity/Asset"; // Import Asset entity

const seedDatabase = async () => {
  try {
    await AppDataSource.initialize();
    // Generate 20 users
    const users = Array.from({ length: 20 }).map((_, i) => {
      const user = new User();
      user.email = `user${i + 1}@example.com`;
      user.role = i % 2 === 0 ? "admin" : "user";
      user.password_hash = `hashedPassword${i + 1}`;
      return user;
    });

    await userRepository.save(users);

    // Generate 20 employees
    const employees = Array.from({ length: 20 }).map((_, i) => {
      const employee = new Employee();
      employee.fullName = `Employee${i + 1}`;
      employee.employeeNo = i + 1; // Unique employee number
      employee.fullName = `FirstName${i + 1} LastName${i + 1}`;
      employee.floor = "5";
      employee.joiningDate = new Date(
        Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)
      ).toDateString(); // Random joining date within the last 5 years
      employee.department = ["Engineering", "HR", "Finance", "Marketing"][
        i % 4
      ]; // Cycle through departments
      return employee;
    });

    await employeeRepository.save(employees);

    // Generate 20 assets
    const assets = Array.from({ length: 20 }).map((_, i) => {
      const asset = new Asset();
      asset.created_by = users[i]; // Set created_by as User object
      asset.created_at = new Date();
      asset.last_updated_at = asset.created_at;
      asset.data = { RAM: `${8 + (i % 4)}GB`, CPU: `Intel i${5 + (i % 5)}` };

      return asset; // Return the asset object
    });

    await assetRepository.save(assets);
    console.log("Seeding completed successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1);
  }
};

seedDatabase();

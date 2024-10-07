import { config } from "dotenv";
config();
import { AppDataSource } from "./database/data-source";
import app from "./config/app";

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(async () => {
    console.log("mysql database connected");
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

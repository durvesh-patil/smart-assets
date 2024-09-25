import { config } from 'dotenv';
config()
import app from "./config/app"
import { AppDataSource } from "./database/data-source"

AppDataSource.initialize().then(async () => {
    console.log("mysql database connected")
}).catch(error => console.log(error))


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
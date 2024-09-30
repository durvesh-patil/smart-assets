import express from "express";
import cors from "cors"; // Import cors
import authRouter from "./routes/auth.routes"; // Adjust the path as necessary
import { config } from 'dotenv';
config();
import { AppDataSource } from "./database/data-source";

const app = express();
const PORT = process.env.PORT || 5000;

// Use cors middleware
app.use(cors({
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true // Allow credentials if needed
}));

app.use(express.json()); // Middleware to parse JSON requests
app.use("/api/v1/auth", authRouter); // Ensure this matches your front-end request

AppDataSource.initialize()
    .then(async () => {
        console.log("mysql database connected");
    })
    .catch(error => console.log(error));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

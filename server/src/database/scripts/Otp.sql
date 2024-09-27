CREATE TABLE `otp` (
    `otp` int NOT NULL,
    `email` varchar(255) NOT NULL,
    `created_at` varchar(255) NOT NULL DEFAULT 'Fri Sep 27 2024 19:53:41 GMT+0530 (India Standard Time)',
    PRIMARY KEY (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
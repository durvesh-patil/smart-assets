CREATE TABLE `employee` (
    `id` int NOT NULL AUTO_INCREMENT,
    `employeeNo` int NOT NULL,
    `fullName` varchar(255) NOT NULL,
    `joiningDate` varchar(255) NOT NULL,
    `resignDate` varchar(255) NOT NULL DEFAULT 'N/A',
    `department` varchar(255) NOT NULL,
    `floor` varchar(255) NOT NULL,
    `emailId` varchar(255) NOT NULL,
    `skypeId` varchar(255) NOT NULL DEFAULT 'N/A',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
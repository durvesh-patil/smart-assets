CREATE TABLE `asm`.`asset` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `created_by` INT NULL,
    `assigned_to` INT NULL,
    `template_id` INT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` VARCHAR(45) NOT NULL,
    `notes` VARCHAR(45) NULL,
    `last_updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `data` JSON NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_asset_created_by` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_asset_assigned_to` FOREIGN KEY (`assigned_to`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_asset_template_id` FOREIGN KEY (`template_id`) REFERENCES `asset_template`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `asm`.`asset_template` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fields JSON NULL,
  notes VARCHAR(45) NULL,
  CONSTRAINT `fk_created_by` FOREIGN KEY (created_by) REFERENCES `user`(id) ON DELETE CASCADE
);

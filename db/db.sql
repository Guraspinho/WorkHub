USE sweeft;
CREATE TABLE `companies` (
  `companies_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(20) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `country` VARCHAR(60) NOT NULL,
  `industry` VARCHAR(100) NOT NULL,
  `verified` boolean NOT NULL DEFAULT false
  `encrypred_email` VARCHAR(200) NOT NULL -- for email confirmation purposes
);

CREATE TABLE `subscription_plans` (
	`subscription_plan_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	`name` ENUM('free','basic','premium') NOT NULL,
	`price` DECIMAL(10, 2), 
	`expired` boolean default false,
	`PriceByFiles` DOUBLE Default 0,
	`files` INT UNSIGNED not null,
	`users` INT UNSIGNED not null,
	`companies_id` INT UNSIGNED,
  FOREIGN KEY (`companies_id`) REFERENCES `companies` (`companies_id`)
);

CREATE TABLE `employees` (
  `employees_id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(55) NOT NULL,
  `email` varchar(255) NOT NULL,
  `files` text NOT NULL,
  `companies_id`  INT UNSIGNED, -- Add the reference column definition
  `password` VARCHAR(200),
  `verified` boolean DEFAULT false,
  `encrypted_email` varchar(200),
  FOREIGN KEY (`companies_id`) REFERENCES `companies` (`companies_id`)
);

CREATE TABLE files (
  `files_id` INT PRIMARY KEY AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `filepath` VARCHAR(255) NOT NULL,
  `filesize` BIGINT NOT NULL,
  `mimetype` VARCHAR(255) NOT NULL,
  `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `employees_id` INT unsigned,
  FOREIGN KEY (`employees_id`) REFERENCES `employees`(`employees_id`) -- Foreign key to user table (replace with actual user table name)
);
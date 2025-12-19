CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL DEFAULT '1234',
    `name` VARCHAR(100) NOT NULL,
    `height` FLOAT NOT NULL COMMENT 'cm',
    `target_weight` FLOAT NOT NULL COMMENT 'kg',
    `goal` VARCHAR(50) NOT NULL COMMENT 'HealthGoal enum',
    `age` INT NOT NULL,
    `gender` ENUM('남', '여') NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `weight_records` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '프론트엔드 UUID',
    `user_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `weight` FLOAT NOT NULL,
    `height` FLOAT COMMENT '기록 당시 키',
    `bmi` FLOAT NOT NULL,
    `memo` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_user_date` (`user_id`, `date`),
    CONSTRAINT `fk_weight_user`
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;
ALTER TABLE weight_records MODIFY id INT NOT NULL AUTO_INCREMENT;

CREATE TABLE `workout_records` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '프론트엔드 UUID',
    `user_id` INT NOT NULL,
    `date` DATETIME NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `intensity` ENUM('낮음', '보통', '높음') NOT NULL,
    `duration` INT NOT NULL COMMENT '분',
    `met` FLOAT NOT NULL,
    `calories` FLOAT NOT NULL,
    `completed` BOOLEAN DEFAULT FALSE,
    `title` VARCHAR(255) NOT NULL,
    `memo` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_workout_user`
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `health_metrics` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `systolic` INT NOT NULL COMMENT '수축기 혈압',
    `diastolic` INT NOT NULL COMMENT '이완기 혈압',
    `blood_sugar` INT NOT NULL,
    `sleep_hours` FLOAT NOT NULL,
    `sleep_start` TIME DEFAULT NULL COMMENT '취침 시각',
    `sleep_end` TIME DEFAULT NULL COMMENT '기상 시각',
    `sleep_quality` VARCHAR(20) DEFAULT NULL COMMENT '수면 품질',
    `prep_duration` INT DEFAULT 0 COMMENT '취침 준비 시간(분)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_health_user`
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `meal_logs` (
    `id` VARCHAR(36) PRIMARY KEY COMMENT '프론트엔드 UUID',
    `user_id` INT NOT NULL,
    `date` DATE NOT NULL,
    `target_kcal` INT NOT NULL,
    `recommendation` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_meal_user`
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;
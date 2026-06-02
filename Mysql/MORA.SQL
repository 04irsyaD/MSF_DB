-- monaraprod.Absen definition

CREATE TABLE `Absen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Absen_date_key` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.Category definition

CREATE TABLE `Category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.CategoryPic definition

CREATE TABLE `CategoryPic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` enum('personil_onsite','personil_oncall') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.DaftarKontak definition

CREATE TABLE `DaftarKontak` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `keterangan` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DaftarKontak_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.Menu definition

CREATE TABLE `Menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- monaraprod.Migrations definition

CREATE TABLE `Migrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.PersonalAccessTokens definition

CREATE TABLE `PersonalAccessTokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` datetime(3) DEFAULT NULL,
  `expires_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.`Role` definition

CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- monaraprod.Shift definition

CREATE TABLE `Shift` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Shift_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1119912 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.TicketLog definition

CREATE TABLE `TicketLog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_ticket` int NOT NULL,
  `open` int DEFAULT NULL,
  `pending` int DEFAULT NULL,
  `close` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=973 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- monaraprod.RolePermission definition

CREATE TABLE `RolePermission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `permission` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `RolePermission_Menu_FK` (`menu_id`),
  KEY `RolePermission_Role_FK` (`role_id`),
  CONSTRAINT `RolePermission_Menu_FK` FOREIGN KEY (`menu_id`) REFERENCES `Menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `RolePermission_Role_FK` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- monaraprod.ServiceProvider definition

CREATE TABLE `ServiceProvider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_category` int NOT NULL,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_shift` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ServiceProvider_name_key` (`name`),
  KEY `ServiceProvider_id_category_fkey` (`id_category`),
  KEY `ServiceProvider_id_shift_fkey` (`id_shift`),
  CONSTRAINT `ServiceProvider_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ServiceProvider_id_shift_fkey` FOREIGN KEY (`id_shift`) REFERENCES `Shift` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.ServiceStatus definition

CREATE TABLE `ServiceStatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('normal','alert','critical') NOT NULL,
  `issue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `catatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `id_service_provider` int NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  `pic_name` text,
  PRIMARY KEY (`id`),
  KEY `ServiceStatus_ServiceProvider_FK` (`id_service_provider`),
  CONSTRAINT `ServiceStatus_ServiceProvider_FK` FOREIGN KEY (`id_service_provider`) REFERENCES `ServiceProvider` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- monaraprod.SesiShift definition

CREATE TABLE `SesiShift` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` time NOT NULL,
  `endtime` time NOT NULL,
  `id_shift` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `SesiShift_id_shift_fkey` (`id_shift`),
  CONSTRAINT `SesiShift_id_shift_fkey` FOREIGN KEY (`id_shift`) REFERENCES `Shift` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=358 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.Ticket definition

CREATE TABLE `Ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `open` int NOT NULL,
  `pending` int NOT NULL,
  `close` int NOT NULL,
  `id_service_provider` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Ticket_ServiceProvider_FK` (`id_service_provider`),
  CONSTRAINT `Ticket_ServiceProvider_FK` FOREIGN KEY (`id_service_provider`) REFERENCES `ServiceProvider` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.`User` definition

CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_Role_FK` (`role_id`),
  CONSTRAINT `User_Role_FK` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1050 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.DetailAbsen definition

CREATE TABLE `DetailAbsen` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `status` enum('masuk','sakit','izin','alpha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `DetailAbsen_id_user_key` (`id_user`),
  CONSTRAINT `DetailAbsen_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.DutyManager definition

CREATE TABLE `DutyManager` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `id_sesi_shift` int DEFAULT NULL,
  `name_shift` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` time DEFAULT NULL,
  `endtime` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DutyManager_id_sesi_shift_fkey` (`id_sesi_shift`),
  CONSTRAINT `DutyManager_id_sesi_shift_fkey` FOREIGN KEY (`id_sesi_shift`) REFERENCES `SesiShift` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=288 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.Pic definition

CREATE TABLE `Pic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `id_service_provider` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Pic_id_service_provider_fkey` (`id_service_provider`),
  CONSTRAINT `Pic_id_service_provider_fkey` FOREIGN KEY (`id_service_provider`) REFERENCES `ServiceProvider` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3421 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.ServiceOperation definition

CREATE TABLE `ServiceOperation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `id_service_provider` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ServiceOperation_id_service_provider_fkey` (`id_service_provider`),
  CONSTRAINT `ServiceOperation_id_service_provider_fkey` FOREIGN KEY (`id_service_provider`) REFERENCES `ServiceProvider` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3074 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.SesiServiceOperation definition

CREATE TABLE `SesiServiceOperation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_sesi_shift` int NOT NULL,
  `id_service_operation` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `SesiServiceOperation_id_sesi_shift_fkey` (`id_sesi_shift`),
  KEY `SesiServiceOperation_id_service_operation_fkey` (`id_service_operation`),
  CONSTRAINT `SesiServiceOperation_id_service_operation_fkey` FOREIGN KEY (`id_service_operation`) REFERENCES `ServiceOperation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `SesiServiceOperation_id_sesi_shift_fkey` FOREIGN KEY (`id_sesi_shift`) REFERENCES `SesiShift` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7810 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.DetailDutyManager definition

CREATE TABLE `DetailDutyManager` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_duty_manager` int NOT NULL,
  `id_user` int NOT NULL,
  `status` enum('dm','codm') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DetailDutyManager_id_duty_manager_fkey` (`id_duty_manager`),
  KEY `DetailDutyManager_User_FK` (`id_user`),
  CONSTRAINT `DetailDutyManager_id_duty_manager_fkey` FOREIGN KEY (`id_duty_manager`) REFERENCES `DutyManager` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DetailDutyManager_User_FK` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=537 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.DetailPic definition

CREATE TABLE `DetailPic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_category_pic` int NOT NULL,
  `id_user` int DEFAULT NULL,
  `id_pic` int NOT NULL,
  `id_sesi_shift` int DEFAULT NULL,
  `id_service_provider` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `DetailPic_id_category_pic_fkey` (`id_category_pic`),
  KEY `DetailPic_id_user_fkey` (`id_user`),
  KEY `DetailPic_id_pic_fkey` (`id_pic`),
  KEY `DetailPic_SesiShift_FK` (`id_sesi_shift`),
  CONSTRAINT `DetailPic_id_category_pic_fkey` FOREIGN KEY (`id_category_pic`) REFERENCES `CategoryPic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DetailPic_id_pic_fkey` FOREIGN KEY (`id_pic`) REFERENCES `Pic` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DetailPic_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DetailPic_SesiShift_FK` FOREIGN KEY (`id_sesi_shift`) REFERENCES `SesiShift` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8615 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- monaraprod.DetailSesiServiceOperation definition

CREATE TABLE `DetailSesiServiceOperation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('normal','alert','critical') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `issue` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `photo_evidence` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `catatan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `customer` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_sesi_service_operation` int NOT NULL,
  `id_user` int NOT NULL,
  `time` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `pic_name` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `DetailSesiServiceOperation_id_sesi_service_operation_fkey` (`id_sesi_service_operation`),
  KEY `DetailSesiServiceOperation_id_user_fkey` (`id_user`),
  CONSTRAINT `DetailSesiServiceOperation_id_sesi_service_operation_fkey` FOREIGN KEY (`id_sesi_service_operation`) REFERENCES `SesiServiceOperation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `DetailSesiServiceOperation_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1754 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
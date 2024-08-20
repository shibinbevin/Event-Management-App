-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: eventmgmt
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `active_session`
--

DROP TABLE IF EXISTS `active_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `active_session` (
  `id` varchar(255) NOT NULL,
  `token` text NOT NULL,
  `userId` text NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_session`
--

LOCK TABLES `active_session` WRITE;
/*!40000 ALTER TABLE `active_session` DISABLE KEYS */;
INSERT INTO `active_session` VALUES ('ead7c6fb-04ed-412b-91ea-a1e30af44361','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAxIiwibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjM0NTg1ODIsImV4cCI6MTcyMzU0NDk4Mn0.1M_EUJA1kRk1d0qvrKKtHlNkpV335LZG34XePuqsJc8','101','2024-08-12 15:59:42');
/*!40000 ALTER TABLE `active_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `category` (
  `category_id` varchar(255) NOT NULL,
  `category_name` text NOT NULL,
  `description` text,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('1002','Music & Concerts','lorem ipsum'),('1003','Sports & Fitness','lorem ipsum'),('1004','Business & Seminars','lorem ipsum'),('f481bea2-e6a3-4fab-9174-96baa1324f70','Food & Drinks','lorem ipsum');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `event` (
  `event_id` varchar(255) NOT NULL,
  `event_name` text NOT NULL,
  `venue_id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `organizer_name` varchar(255) DEFAULT NULL,
  `event_date` date NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tickets_available` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'pending',
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `venue` (`venue_id`),
  KEY `category` (`category_id`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`),
  CONSTRAINT `event_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES ('26fe6f0a-b1a4-4de6-8a76-4250c0700c7d','Deadpool Premier ','f1121631-063d-4fd5-a470-57674b8585b4','1003','Marvel Studios','2024-08-02','2024-07-26 16:49:52',295,'active','uploads\\1722855816923.jpg'),('58b75221-e6e3-4679-b73d-a4539c337ab7','Admin Event','f1121631-063d-4fd5-a470-57674b8585b4','1002','Admin','2024-07-27','2024-07-26 14:39:28',300,'active','uploads\\1722855831540.jpg'),('a5768358-ced7-465e-8988-9ded85f421ba','Horizon Festival ','e9a40a91-aa71-4fb0-8285-5adf25bd456c','1003','Turn10','2024-09-06','2024-07-26 16:46:02',100,'active','uploads\\1722855880209.jpg'),('a68782a3-89d4-42bc-8927-ccca6c41e77c','Vista Festival ','f1121631-063d-4fd5-a470-57674b8585b4','1004','asdfhh','2024-08-15','2024-08-01 15:33:50',295,'active','uploads\\1722855912677.jpg'),('b338f2db-1b79-4987-8bbe-e1a7ffb4f3be','Vista Festival ','e9a40a91-aa71-4fb0-8285-5adf25bd456c','1003','UST','2024-07-27','2024-07-26 16:44:36',95,'active','uploads\\1722855895942.jpg'),('c2a585b3-fee7-48bc-b75f-12a205ba03e4','User Event','e9a40a91-aa71-4fb0-8285-5adf25bd456c','1004','James','2024-08-09','2024-07-26 14:40:11',98,'active','uploads\\1722855803804.jpg'),('d0bc3097-9e7f-4c9e-ba1a-fba1bda397a9','Sunburn Festival','fa4da598-13f5-40d8-88d1-57adb9e59a9c','1002','Sunburn ','2024-08-24','2024-08-08 12:04:44',500,'active','uploads\\1723098884595.jpg');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `migrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,1626737786922,'init1626737786922');
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `role` (
  `id` varchar(255) NOT NULL,
  `name` text NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES ('1','admin','2024-06-24 10:38:16'),('2','user','2024-06-24 10:38:16');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `ticket` (
  `ticket_id` varchar(255) NOT NULL,
  `ticket_count` int(11) DEFAULT NULL,
  `event_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_id`),
  KEY `event_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`),
  CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES ('07e16ac8-6706-4ae4-ba34-636743135ad0',3,'b338f2db-1b79-4987-8bbe-e1a7ffb4f3be','cbc461a0-9447-470f-9a09-065dff90b03e','2024-07-30 10:30:59'),('34633e0b-0ce7-4580-960d-deb016bdc295',2,'c2a585b3-fee7-48bc-b75f-12a205ba03e4','cbc461a0-9447-470f-9a09-065dff90b03e','2024-08-05 15:06:47'),('886b851b-e59a-4ae5-a285-ae747f050aa6',2,'b338f2db-1b79-4987-8bbe-e1a7ffb4f3be','cbc461a0-9447-470f-9a09-065dff90b03e','2024-07-30 10:39:07'),('8cd4f573-2ae7-46e9-8ac8-6c240c2caca1',5,'a68782a3-89d4-42bc-8927-ccca6c41e77c','05dffad6-d373-4109-943f-5c981ed24905','2024-08-06 10:15:45'),('b7efcedc-f235-4e4b-b5eb-0b8d81abed24',5,'26fe6f0a-b1a4-4de6-8a76-4250c0700c7d','6db3ac73-7800-4587-b743-9fa1cac12ac5','2024-07-29 10:42:49');
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `user_id` varchar(255) NOT NULL,
  `name` text,
  `email` text,
  `password` text,
  `user_role` varchar(255) DEFAULT NULL,
  `dob` date NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `security_question` varchar(255) DEFAULT NULL,
  `security_answer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `user_role` (`user_role`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`user_role`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('05dffad6-d373-4109-943f-5c981ed24905','hello','hello@gmail.com','$2a$10$y2z8PfocVsxwRf4NoJ8lC.IWpgTdAY/7rX/pvSlJnjnT7bLPrTaAO','2','2024-06-26','2024-06-24 10:44:03',NULL,NULL),('101','admin','admin@gmail.com','$2a$10$Nspc7eoDvRSq5F2wE9H8vuIRJwlCH3cOq/d7p1LSJNOjkSKxorFWS','1','2002-12-12','2024-06-28 17:50:25',NULL,NULL),('6db3ac73-7800-4587-b743-9fa1cac12ac5','James','james@gmail.com','$2a$10$OcGpR/vBX22ZWl13ZqXPe.NjDAumxVgnKOrsgJjGjwWmB4hMgNiPu','2','2024-07-24','2024-07-22 14:41:08',NULL,NULL),('8a49aba6-ee28-4a01-87e5-9472454bce74','jessie','jessie@gmail.com','$2a$10$EaARGRSlaIJmB6UYpJq7hOTknxmMBmDcwzsBqSkM3fP2tVM6O38aS','2','2008-02-12','2024-07-24 11:28:14',NULL,NULL),('a23c8ead-cc13-431b-ac21-b4fa7b118115','Adam','adam@gmail.com','$2a$10$.NiRE7RjSqOOyid8p6Wb6.X2nyh/y0D4sMyCtqMXGK2imL4xjfWcS','2','2000-06-15','2024-08-07 16:41:42','What was the name of your first pet?','Charlie'),('cbc461a0-9447-470f-9a09-065dff90b03e','Aaron A','aaron@gmail.com','$2a$10$4fQ5LOL9OyWQyd.f/SAPqOJk00jKzsLinuu0kcP1zt.d0OteASFQW','2','2008-06-03','2024-07-18 15:38:17',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `venue` (
  `venue_id` varchar(255) NOT NULL,
  `venue_name` text NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `capacity` int(11) NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`venue_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue`
--

LOCK TABLES `venue` WRITE;
/*!40000 ALTER TABLE `venue` DISABLE KEYS */;
INSERT INTO `venue` VALUES ('e9a40a91-aa71-4fb0-8285-5adf25bd456c','Ark Arena','Chennai','India',100,1,'2024-07-23 16:13:12'),('f1121631-063d-4fd5-a470-57674b8585b4','New Venue','Chennai','India',300,1,'2024-07-17 14:26:25'),('fa4da598-13f5-40d8-88d1-57adb9e59a9c','Sunburn Arena','Kochi','India',500,1,'2024-08-08 12:03:07');
/*!40000 ALTER TABLE `venue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-20 15:58:12

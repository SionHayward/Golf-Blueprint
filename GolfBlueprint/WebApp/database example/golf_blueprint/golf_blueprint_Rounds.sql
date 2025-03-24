-- MySQL dump 10.13  Distrib 8.0.41, for macos15 (arm64)
--
-- Host: localhost    Database: golf_blueprint
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Rounds`
--

DROP TABLE IF EXISTS `Rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rounds` (
  `round_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int DEFAULT '1',
  `date_played` datetime NOT NULL,
  `weather_conditions` varchar(50) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`round_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `rounds_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `rounds_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Rounds`
--

LOCK TABLES `Rounds` WRITE;
/*!40000 ALTER TABLE `Rounds` DISABLE KEYS */;
INSERT INTO `Rounds` VALUES (1,1,1,'2025-02-14 00:00:00',NULL,NULL),(2,1,1,'2025-03-02 00:00:00',NULL,NULL),(4,1,1,'2025-03-05 00:00:00',NULL,NULL),(5,1,1,'2025-01-01 00:00:00',NULL,NULL);
/*!40000 ALTER TABLE `Rounds` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-24 22:22:16

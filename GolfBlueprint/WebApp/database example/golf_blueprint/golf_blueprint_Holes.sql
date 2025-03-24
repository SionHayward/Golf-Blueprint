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
-- Table structure for table `Holes`
--

DROP TABLE IF EXISTS `Holes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Holes` (
  `hole_id` int NOT NULL AUTO_INCREMENT,
  `course_id` int DEFAULT '1',
  `hole_number` int NOT NULL,
  `par` int NOT NULL,
  `distance_yards` int NOT NULL,
  PRIMARY KEY (`hole_id`),
  UNIQUE KEY `course_id` (`course_id`,`hole_number`),
  CONSTRAINT `holes_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Holes`
--

LOCK TABLES `Holes` WRITE;
/*!40000 ALTER TABLE `Holes` DISABLE KEYS */;
INSERT INTO `Holes` VALUES (1,1,1,4,295),(2,1,2,3,148),(3,1,3,5,531),(4,1,4,4,323),(5,1,5,5,515),(6,1,6,3,148),(7,1,7,4,433),(8,1,8,5,477),(9,1,9,3,118),(10,1,10,4,406),(11,1,11,3,131),(12,1,12,4,393),(13,1,13,5,437),(14,1,14,4,438),(15,1,15,4,436),(16,1,16,4,358),(17,1,17,3,171),(18,1,18,4,360);
/*!40000 ALTER TABLE `Holes` ENABLE KEYS */;
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

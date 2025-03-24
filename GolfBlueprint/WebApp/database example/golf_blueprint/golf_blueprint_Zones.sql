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
-- Table structure for table `Zones`
--

DROP TABLE IF EXISTS `Zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Zones` (
  `zone_id` int NOT NULL AUTO_INCREMENT,
  `hole_id` int NOT NULL,
  `zone_name` varchar(50) NOT NULL,
  `zone_type` enum('Tee','Fairway','Rough','Green','Bunker','Water','Trees','Out of Bounds','Other') DEFAULT 'Other',
  PRIMARY KEY (`zone_id`),
  UNIQUE KEY `hole_id` (`hole_id`,`zone_name`),
  CONSTRAINT `zones_ibfk_1` FOREIGN KEY (`hole_id`) REFERENCES `Holes` (`hole_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Zones`
--

LOCK TABLES `Zones` WRITE;
/*!40000 ALTER TABLE `Zones` DISABLE KEYS */;
INSERT INTO `Zones` VALUES (1,1,'Long Fairway','Fairway'),(2,1,'Green','Green'),(3,2,'Rough','Rough'),(4,2,'Green','Green'),(5,3,'Long Fairway','Fairway'),(6,3,'Green','Green'),(7,4,'Mid Fairway','Fairway'),(8,4,'Green','Green'),(9,5,'Long Fairway','Fairway'),(10,5,'Green','Green'),(11,6,'Green','Green'),(12,7,'Mid Fairway','Fairway'),(13,7,'Green','Green'),(14,8,'Long Fairway','Fairway'),(15,8,'Green','Green'),(16,9,'Green','Green'),(17,10,'Mid Fairway','Fairway'),(18,10,'Green','Green'),(19,11,'Green','Green'),(20,12,'Mid Fairway','Fairway'),(21,12,'Green','Green'),(22,13,'Mid Fairway','Fairway'),(23,13,'Green','Green'),(24,14,'Mid Fairway','Fairway'),(25,14,'Long Fairway','Fairway'),(26,14,'Green','Green'),(27,15,'Mid Fairway','Fairway'),(28,15,'Green','Green'),(29,16,'Mid Fairway','Fairway'),(30,16,'Green','Green'),(31,17,'Green','Green'),(32,18,'Mid Fairway','Fairway'),(33,18,'Green','Green'),(34,1,'Short Fairway','Fairway'),(35,3,'Mid Fairway','Fairway'),(36,5,'Short Right Rough','Rough'),(37,5,'Mid Fairway','Fairway'),(38,7,'Mid Left Rough','Rough'),(39,8,'Outer Rough','Rough'),(40,8,'Short Fairway','Fairway'),(41,8,'Short Right','Other'),(42,10,'Short Right','Other'),(43,12,'Long Fairway','Fairway'),(44,13,'Long Right Outer Rough','Rough'),(45,13,'Short Right','Other'),(46,14,'Mid Right Trees','Trees'),(47,15,'Short Left','Other'),(48,18,'Long Right Rough','Rough'),(49,18,'Back Left','Other'),(50,2,'Short Left','Other'),(51,3,'Short Right','Other'),(52,5,'Short Fairway','Fairway'),(53,5,'Short Left','Other'),(54,6,'Short Right','Other'),(55,7,'Mid Left Trees','Trees'),(56,8,'Fairway Bunker','Fairway'),(57,8,'Mid Fairway','Fairway'),(58,10,'Short Left','Other'),(59,11,'Short Left','Other'),(60,13,'Short Left','Other'),(61,14,'Short Left Rough','Rough'),(62,14,'Short Left','Other'),(63,15,'Mid Right Rough','Rough'),(64,16,'Mid Left Rough','Rough'),(65,17,'Long Right','Other'),(66,18,'Mid Right Rough','Rough'),(67,1,'Short Right','Other'),(68,18,'Mid Left Rough','Rough'),(69,13,'Long Right Rough','Rough'),(70,2,'Long Left','Other'),(71,4,'Mid Right Trees','Trees'),(72,5,'Mid Right Rough','Rough'),(73,5,'Short Right','Other'),(74,6,'Greenside Bunker','Green'),(75,7,'Mid Right Rough','Rough'),(76,7,'Short Right','Other'),(77,9,'Short Left','Other'),(78,10,'Mid Left Rough','Rough'),(79,11,'Long Right','Other'),(80,12,'Mid Right Rough','Rough'),(81,14,'Mid Right Rough','Rough'),(82,15,'Mid Left Rough','Rough'),(83,15,'Short Right','Other'),(84,16,'Mid Right Rough','Rough'),(85,16,'Long Fairway','Fairway'),(86,17,'Short Left','Other');
/*!40000 ALTER TABLE `Zones` ENABLE KEYS */;
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

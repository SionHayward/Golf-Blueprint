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
-- Temporary view structure for view `holeanalysis`
--

DROP TABLE IF EXISTS `holeanalysis`;
/*!50001 DROP VIEW IF EXISTS `holeanalysis`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `holeanalysis` AS SELECT 
 1 AS `hole_number`,
 1 AS `zone_name`,
 1 AS `average_score`,
 1 AS `shot_count`,
 1 AS `best_score`,
 1 AS `worst_score`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `userstatistics`
--

DROP TABLE IF EXISTS `userstatistics`;
/*!50001 DROP VIEW IF EXISTS `userstatistics`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `userstatistics` AS SELECT 
 1 AS `user_id`,
 1 AS `username`,
 1 AS `total_rounds`,
 1 AS `average_score`,
 1 AS `average_putts_per_hole`,
 1 AS `fairway_hit_percentage`,
 1 AS `gir_percentage`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `holeanalysis`
--

/*!50001 DROP VIEW IF EXISTS `holeanalysis`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `holeanalysis` AS select `h`.`hole_number` AS `hole_number`,`z`.`zone_name` AS `zone_name`,avg(`rh`.`score`) AS `average_score`,count(distinct `s`.`shot_id`) AS `shot_count`,min(`rh`.`score`) AS `best_score`,max(`rh`.`score`) AS `worst_score` from (((`shots` `s` join `zones` `z` on((`s`.`zone_id` = `z`.`zone_id`))) join `roundholes` `rh` on((`s`.`round_hole_id` = `rh`.`round_hole_id`))) join `holes` `h` on((`rh`.`hole_id` = `h`.`hole_id`))) group by `h`.`hole_number`,`z`.`zone_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `userstatistics`
--

/*!50001 DROP VIEW IF EXISTS `userstatistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `userstatistics` AS select `u`.`user_id` AS `user_id`,`u`.`username` AS `username`,count(distinct `r`.`round_id`) AS `total_rounds`,avg(`rh`.`score`) AS `average_score`,(sum(`rh`.`putts`) / count(`rh`.`round_hole_id`)) AS `average_putts_per_hole`,(count((case when (`rh`.`fairway_hit` = 1) then 1 end)) / count((case when (`h`.`par` > 3) then 1 end))) AS `fairway_hit_percentage`,(count((case when (`rh`.`green_in_regulation` = 1) then 1 end)) / count(`rh`.`round_hole_id`)) AS `gir_percentage` from (((`users` `u` join `rounds` `r` on((`u`.`user_id` = `r`.`user_id`))) join `roundholes` `rh` on((`r`.`round_id` = `rh`.`round_id`))) join `holes` `h` on((`rh`.`hole_id` = `h`.`hole_id`))) group by `u`.`user_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-24 22:22:16

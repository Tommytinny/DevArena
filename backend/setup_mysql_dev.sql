-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS DevArena;
CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'Wakeup_11!';
GRANT ALL PRIVILEGES ON `DevArena`.* TO 'admin'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;


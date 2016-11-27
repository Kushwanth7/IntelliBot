DROP TABLE IF EXISTS Intellibot.TrainingData;

CREATE DATABASE IF NOT EXISTS Intellibot;

USE Intellibot;

CREATE TABLE IF NOT EXISTS Intellibot.TrainingData
(
dataid INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
question TEXT,
answer TEXT
);

#SAMPLE insert statement
INSERT INTO Intellibot.TrainingData(question,answer) VALUES("TEST QUESTION", "TEST ANSWER");

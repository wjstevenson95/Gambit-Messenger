SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS gambit_messengerdb DEFAULT CHARACTER SET utf8;
USE gambit_messengerdb;


DROP TABLE IF EXISTS users;
CREATE TABLE users(user_id INT NOT NULL AUTO_INCREMENT,
					email VARCHAR(255) NOT NULL,
					password VARCHAR(40) NOT NULL,
					first_name VARCHAR(20) NOT NULL,
					last_name VARCHAR(20),
					phone VARCHAR(10),
					is_active TINYINT(1) DEFAULT 0,
					registration_date DATETIME DEFAULT CURRENT_TIMESTAMP(),
					PRIMARY KEY(user_id))
ENGINE = InnoDB;

DROP TABLE IF EXISTS messages;
CREATE TABLE messages(message_id INT NOT NULL AUTO_INCREMENT,
					sender INT NOT NULL,
					message_type ENUM('text','image','video','audio'),
					message VARCHAR(1400),
					attachment_url VARCHAR(255),
					sent DATETIME,
					PRIMARY KEY(message_id),
					FOREIGN KEY(sender) REFERENCES users(user_id))
ENGINE = InnoDB;


DROP TABLE IF EXISTS receivers;
CREATE TABLE receivers(message_id INT,
					receiver_id INT NOT NULL,
					PRIMARY KEY(message_id,receiver_id),
					FOREIGN KEY(message_id) REFERENCES messages(message_id),
					FOREIGN KEY(receiver_id) REFERENCES users(user_id))
ENGINE = InnoDB;

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts(user1 INT,
					user2 INT,
					PRIMARY KEY(user1,user2),
					FOREIGN KEY(user1) REFERENCES users(user_id),
					FOREIGN KEY(user2) REFERENCES users(user_id),
					CHECK(user1 < user2))
ENGINE = InnoDB;

DROP TABLE IF EXISTS pending_contacts;
CREATE TABLE pending_contacts(user INT,
							pending_friend INT,
							PRIMARY KEY(user,pending_friend),
							FOREIGN KEY(user) REFERENCES users(user_id),
							FOREIGN KEY(pending_friend) REFERENCES users(user_id))
ENGINE = InnoDB;

DROP TABLE IF EXISTS group_chats;
CREATE TABLE group_chats(group_id VARCHAR(20),
						owner INT NOT NULL,
						created_at DATETIME,
						updated_at DATETIME,
						PRIMARY KEY(group_id),
						FOREIGN KEY(owner) REFERENCES users(user_id))
ENGINE = InnoDB;

DROP TABLE IF EXISTS group_chat_messages;
CREATE TABLE group_chat_messages(message_id INT,
								group_id VARCHAR(20),
								PRIMARY KEY(message_id,group_id),
								FOREIGN KEY(message_id) REFERENCES messages(message_id),
								FOREIGN KEY(group_id) REFERENCES group_chats(group_id))
ENGINE = InnoDB;

DROP TABLE IF EXISTS group_chat_members;
CREATE TABLE group_chat_members(member_id INT,
								group_id VARCHAR(20),
								PRIMARY KEY(member_id,group_id),
								FOREIGN KEY(member_id) REFERENCES users(user_id),
								FOREIGN KEY(group_id) REFERENCES group_chats(group_id))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


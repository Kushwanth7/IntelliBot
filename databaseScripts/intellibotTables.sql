USE Intellibot;

CREATE TABLE IF NOT EXISTS Intellibot.UserProfile
(
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	phone_number varchar(500) unique,
	userPassword varchar(500),
	isProfessor boolean
);

insert into Intellibot.UserProfile(phone_number,userPassword,isProfessor)
values("Jebara","password123",true);

insert into Intellibot.UserProfile(phone_number,userPassword,isProfessor)
values("TA","password123",false);

select id,phone_number,userPassword from Intellibot.UserProfile where phone_number = 'jebara'



-- Not tested yet (remove this line when tested)

create table users (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL,
  pw VARCHAR(200) NOT NULL,
  super INT(1) UNSIGNED NOT NULL
);

create table acls (
  id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  rw INT(1) NOT NULL 
);

-- password: password
insert into users (username, pw, super) 
values ('user1', 'PBKDF2$sha256$901$sz54pi2xVpXdwCyu$1UF/q0zkakLpQg0j48ExJOvzXQQfhAeh', 0);

insert into acls (username, topic, rw) 
values ('user1', 'test/topic', 1);
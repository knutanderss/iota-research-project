-- Not tested yet (remove this line when tested)

create table account (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  pw VARCHAR(200) NOT NULL,
  super smallint NOT NULL
);

create table acls (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  rw smallint NOT NULL 
);

-- password: password
insert into account (username, pw, super) 
values ('user1', 'PBKDF2$sha256$901$sz54pi2xVpXdwCyu$1UF/q0zkakLpQg0j48ExJOvzXQQfhAeh', 0);

insert into acls (username, topic, rw) 
values ('user1', 'test/topic', 1);

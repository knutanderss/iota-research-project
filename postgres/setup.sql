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
values ('sensor', 'PBKDF2$sha256$901$sz54pi2xVpXdwCyu$1UF/q0zkakLpQg0j48ExJOvzXQQfhAeh', 1);


insert into account (username, pw, super) 
values ('John', 'PBKDF2$sha256$901$sz54pi2xVpXdwCyu$1UF/q0zkakLpQg0j48ExJOvzXQQfhAeh', 0);


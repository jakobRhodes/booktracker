CREATE TABLE Book (
    Book_ID SERIAL NOT NULL PRIMARY KEY,
    Title varchar(255) NOT NULL,
    Author varchar(255) NOT NULL,
    Genre varchar(255) NOT NULL
);

INSERT INTO Book (Title, Author, Genre)
VALUES ('Charlotte''s Web','E. B. White', 'Fantasy');
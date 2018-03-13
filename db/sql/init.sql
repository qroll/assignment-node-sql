DROP SCHEMA IF EXISTS app;
CREATE SCHEMA app;
USE app;

CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    isSuspended BOOLEAN DEFAULT FALSE
);

CREATE TABLE registration (
    teacherId INT REFERENCES teachers (id),
    studentId INT REFERENCES students (id),
    PRIMARY KEY (teacherId , studentId)
);

-- initialize db with data

INSERT INTO teachers (email) VALUES 
('penelope.fitts@example.com'), 
('jessica.whitwell@example.com'),
('j.stroud@example.com');

INSERT INTO students (email) VALUES 
('lucy.carlyle@gmail.com'), 
('anthony.lockwood@gmail.com'), 
('george.cubbins@gmail.com'), 
('john.mandrake@gmail.com'), 
('jane.farrar@gmail.com'), 
('rebecca.piper@gmail.com');

INSERT INTO registration (teacherId, studentId)
(SELECT t.id, s.id
FROM teachers t, students s 
WHERE t.email LIKE 'penelope.fitts@example.com' 
AND s.email LIKE 'lucy.carlyle@gmail.com');

INSERT INTO registration (teacherId, studentId)
(SELECT t.id, s.id
FROM teachers t, students s 
WHERE t.email LIKE 'penelope.fitts@example.com' 
AND s.email LIKE 'george.cubbins@gmail.com');

INSERT INTO registration (teacherId, studentId)
(SELECT t.id, s.id
FROM teachers t, students s 
WHERE t.email LIKE 'jessica.whitwell@example.com' 
AND s.email LIKE 'john.mandrake@gmail.com');

INSERT INTO registration (teacherId, studentId)
(SELECT t.id, s.id
FROM teachers t, students s 
WHERE t.email LIKE 'jessica.whitwell@example.com' 
AND s.email LIKE 'jane.farrar@gmail.com');

INSERT INTO registration (teacherId, studentId)
(SELECT t.id, s.id
FROM teachers t, students s 
WHERE t.email LIKE 'j.stroud@example.com' 
AND s.email LIKE 'lucy.carlyle@gmail.com');

INSERT INTO registration (teacherId, studentId)
(SELECT t.id, s.id
FROM teachers t, students s 
WHERE t.email LIKE 'j.stroud@example.com' 
AND s.email LIKE 'john.mandrake@gmail.com');

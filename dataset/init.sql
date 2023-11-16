  CREATE TABLE IF NOT EXISTS DEGREE (
    COD_DEGREE varchar(10) PRIMARY KEY,
    TITLE_DEGREE varchar(50) NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS student (
    id varchar(30) PRIMARY KEY,
    surname varchar(100) not NULL,
    name varchar(100) NOT NULL,
    gender varchar(1) NOT NULL,
    nationality varchar(20) NOT NULL,
    email varchar(50) NOT NULL,
    COD_DEGREE varchar(10) NOT NULL,
    ENROLLMENT_YEAR int NOT NULL,
    FOREIGN KEY (COD_DEGREE) references DEGREE(COD_DEGREE)
  );

  CREATE TABLE IF NOT EXISTS DEPARTMENT (
    COD_DEPARTMENT varchar(25) PRIMARY KEY,
    NAME varchar(75) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS GROUPS (
    COD_GROUP varchar(25) PRIMARY KEY,
    COD_DEPARTMENT varchar(25),
    NAME VARCHAR(75) NOT NULL,
    FOREIGN KEY (COD_DEPARTMENT) references DEPARTMENT(COD_DEPARTMENT)
  );

  CREATE TABLE IF NOT EXISTS TEACHER (
    id varchar(30) PRIMARY KEY,
    surname varchar(100) not NULL,
    name varchar(100) NOT NULL,
    email varchar(50) NOT NULL,
    COD_GROUP varchar(25) NOT NULL,
    COD_DEPARTMENT varchar(25) NOT NULL,
    FOREIGN key(COD_GROUP) REFERENCES GROUPS(COD_GROUP),
    FOREIGN key(COD_DEPARTMENT) REFERENCES DEPARTMENT(COD_DEPARTMENT)
 );
 
  CREATE TABLE IF NOT EXISTS EXTERNAL_CO_SUPERVISOR(
   id varchar(30) PRIMARY KEY,
   surname varchar(100) not NULL,
   name varchar(100) NOT NULL,
   email varchar(50) NOT NULL
  );
 
  CREATE TABLE IF NOT EXISTS THESIS_PROPOSAL (
   id serial PRIMARY KEY,
   title varchar(150) NOT NULL,
   SUPERVISOR_id varchar(30) NOT NULL,
   type varchar(30) NOT NULL,
   groups varchar(20) NOT NULL,         /* SHOULD BE CLARIFIED */
   description varchar(500) NOT NULL,
   required_knowledge varchar(50) NOT NULL,
   notes varchar(500),
   level varchar(5) NOT NULL,
   programme varchar(10) NOT NULL,
   deadline date NOT NULL,
   status varchar(10) not NULL,
   FOREIGN KEY (SUPERVISOR_ID) references TEACHER(id),
   FOREIGN KEY (programme) references degree(COD_DEGREE)
  );

  CREATE TABLE IF NOT EXISTS THESIS_CO_SUPERVISION (
    id serial PRIMARY KEY,
    THESIS_PROPOSAL_id int NOT NULL,
    INTERNAL_CO_SUPERVISOR_id varchar(30),
    EXTERNAL_CO_SUPERVISOR_id varchar(30),
    is_external boolean NOT NULL,
    FOREIGN KEY (THESIS_PROPOSAL_id) references THESIS_PROPOSAL(id),
    FOREIGN KEY (INTERNAL_CO_SUPERVISOR_id) references TEACHER(id),
    FOREIGN KEY (EXTERNAL_CO_SUPERVISOR_id) references EXTERNAL_CO_SUPERVISOR(id)
  );


  CREATE TABLE IF NOT EXISTS THESIS_APPLICATION (
    id serial PRIMARY KEY,
    student_id varchar(30) NOT NULL,
    thesis_id serial NOT NULL,
    status varchar(10) NOT NULL DEFAULT 'idle',
    cv_uri varchar(250),
    FOREIGN KEY (student_id) references student(id),
    FOREIGN KEY (thesis_id) references THESIS_PROPOSAL(id),
    UNIQUE (student_id, thesis_id)
  );

  CREATE TABLE IF NOT EXISTS CAREER (
    student_id varchar(30) NOT NULL,
    COD_COURSE varchar(15) NOT NULL,
    TITLE_COURSE varchar(30) NOT NULL,
    CFU int NOT NULL,
    GRADE int NOT NULL,
    ddate date NOT NULL,
    FOREIGN KEY (student_id) references student(id),
    PRIMARY KEY (student_id, COD_COURSE)
  );

  CREATE TABLE IF NOT EXISTS KEYWORDS(
    thesisId int NOT NULL,
    keyword varchar(30),
    FOREIGN key(thesisId) REFERENCES THESIS_PROPOSAL(id),
    PRIMARY key(thesisId, keyword)
  );

  INSERT INTO DEGREE (COD_DEGREE, TITLE_DEGREE) values (
    'LM-32', 'Computer Engineering'
  );

  INSERT INTO DEGREE (COD_DEGREE, TITLE_DEGREE) values (
    'LM-19', 'Chemical Engineering'
  );

  INSERT INTO DEGREE (COD_DEGREE, TITLE_DEGREE) values (
    'LM-21', 'Biomedical Engineering'
  );

  INSERT INTO DEPARTMENT (cod_department, NAME) VALUES('DAUIN', 'Dipartimento di Automatica e Informatica');
  INSERT INTO DEPARTMENT (cod_department, NAME) VALUES('DIMEAS', 'Dipartimento di Ingegneria Meccanica e Aerospaziale');

  INSERT INTO GROUPS VALUES('AAA1', 'DAUIN', 'Gruppo di ML');
  INSERT INTO GROUPS VALUES('AAA2', 'DAUIN', 'Gruppo di Cybersecurity');
  INSERT INTO GROUPS VALUES('AAA3', 'DAUIN', 'Gruppo di Cloud Computing');
  INSERT INTO GROUPS VALUES('AAA4', 'DAUIN', 'Gruppo di Big Data');

  INSERT INTO student(id,name,surname,gender,nationality,email,COD_DEGREE,ENROLLMENT_YEAR) values (
    's123','Marco','Rossi','M','italian','marco.rossi@email.com','LM-32',2019
  );

  INSERT INTO student(id,name,surname,gender,nationality,email,COD_DEGREE,ENROLLMENT_YEAR) values (
    's124','Federica','Verdi','F','italian','federica.verdi@email.com','LM-19',2022
  );

  INSERT INTO student(id,name,surname,gender,nationality,email,COD_DEGREE,ENROLLMENT_YEAR) values (
    's125','Josh','Page','M','usa','josh.page@email.com','LM-21',2018
  );
  
  INSERT INTO TEACHER(id, surname, name, email, COD_GROUP, COD_DEPARTMENT) values (
    't123', 'Bini', 'Enrico', 'bini.enrico@unito.it', 'AAA1', 'DAUIN'
  );
   
 INSERT INTO TEACHER(id, surname, name, email, COD_GROUP, COD_DEPARTMENT) values (
    't124', 'Sereno', 'Matteo', 'sereno.matteo@unito.it', 'AAA2', 'DAUIN'
  );
  
 INSERT INTO TEACHER(id, surname, name, email, COD_GROUP, COD_DEPARTMENT) values (
    't125', 'Alessandro', 'Monsutti', 'alessandro.monsutti@unito.it', 'AAA2', 'DAUIN'
  );

 INSERT INTO EXTERNAL_CO_SUPERVISOR(id, surname, name, email) values (
    'c123', 'Rossi', 'Andrea', 'rossi.andrea@email.it'
  );
  
 INSERT INTO EXTERNAL_CO_SUPERVISOR(id, surname, name, email) values (
    'c124', 'Neri', 'Marco', 'neri.marco@email.it'
  );
  
 INSERT INTO EXTERNAL_CO_SUPERVISOR(id, surname, name, email) values (
    'c125', 'Laura', 'Sambuelli', 'laura.sambuelli@amazon.it'
  );
  
 INSERT INTO EXTERNAL_CO_SUPERVISOR(id, surname, name, email) values (
    'c126', 'Serena', 'Williams', 'serena.williams@email.it'
  );
  
 INSERT INTO EXTERNAL_CO_SUPERVISOR(id, surname, name, email) values (
    'c127', 'Giuseppe', 'Medici', 'giuseppe.medici@email.it'
  );
  

 INSERT INTO THESIS_PROPOSAL(title, SUPERVISOR_ID,
                              type, groups, description, 
                              required_knowledge, notes, level, programme, 
                              deadline, status) VALUES (' Investigating the biomedical applications of coordination cages', 't123', 'Industrial and work', 'Chemistry',
                                                        'Metallocages represent an exciting field of supramolecular chemistry concerned with the assembly of specific ligands and metals to form discrete structures. Coordination cages have applications in catalysis',
                                                        'None', '', 'MSc', 'LM-19',
                                                        '2023-12-31', 'active');

 INSERT INTO THESIS_PROPOSAL(title, SUPERVISOR_ID,
                              type, groups, description, 
                              required_knowledge, notes, level, programme, 
                              deadline, status) VALUES ('Maximising social welfare in selfish multi-modal routing using strategic information design for quantal response travelers', 't124', 'In-company work', 'Cloud Computing',
                                                        'Traditional selfish routing literature quantifies inefficiency in transportation systems with single-attribute costs using price-of-anarchy (PoA), and provides various technical approaches (e.g. marginal cost pricing) to improve PoA of the overall network', 
                                                        'None', '', 'MSc', 'LM-32',
                             							'2024-01-01', 'active');
                                                        
 INSERT INTO THESIS_PROPOSAL(title, SUPERVISOR_ID,
                              type, groups, description, 
                              required_knowledge, notes, level, programme, 
                              deadline, status) VALUES ('AI in Autonomous Vehicles', 't125', 'Practical-based', 'AI and Data Science', 'This thesis explores the implementation of AI in autonomous vehicles, focusing on machine learning algorithms.', 
														'Machine Learning, Computer Vision', 'Please submit a brief overview of your relevant experience.', 'MSc', 'LM-32',
                                                       '2024-03-01', 'active');

 INSERT INTO KEYWORDS VALUES(1, 'Biomedic');
 INSERT INTO KEYWORDS VALUES(1, 'Discrete structures');
 INSERT INTO KEYWORDS VALUES(2, 'Routing');
 INSERT INTO KEYWORDS VALUES(2, 'Networks');
 INSERT INTO KEYWORDS VALUES(3, 'AI');
 INSERT INTO KEYWORDS VALUES(3, 'Autonomous Vehicles');

 INSERT INTO THESIS_APPLICATION(student_id, thesis_id, status, 
                              cv_uri) VALUES ('s123', 1, 'idle', '');
  
 INSERT INTO THESIS_APPLICATION(student_id, thesis_id, status, 
                              cv_uri) VALUES ('s124', 3, 'idle', '');
                              
 INSERT INTO THESIS_APPLICATION(student_id, thesis_id, status, 
                              cv_uri) VALUES ('s125', 3, 'idle', '');
  
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124','01TYM', 'Information Security System', '6', '27', '2023-01-16');
 
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124', '02TWYSM','Database and Data science', '8', '29', '2023-01-22');
  
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124','03TRV', 'Computer Networks', '6', '25', '2023-01-18');
                     
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124', '01GUV','Web Application I', '6', '28', '2023-06-19');
                     
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124', '02GUP','Web Application II', '6', '30', '2023-07-11');
  
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124','01SDPR', 'Systems Device and Programming', '10', '22', '2023-07-14');
                     
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124', '02CDRU','Cloud Computing', '6', '26', '2023-07-15');
                     
 INSERT INTO CAREER (student_id, COD_COURSE, TITLE_COURSE, 
                     CFU, GRADE, ddate) VALUES ('s124', '01BGTR','Big Data', '6', '27', '2023-07-15');
                     
 INSERT INTO THESIS_CO_SUPERVISION (THESIS_PROPOSAL_id, INTERNAL_CO_SUPERVISOR_id,
                                    external_co_supervisor_id, is_external) VALUES (1, 't125', NULL, FALSE);	
                                            
 INSERT INTO THESIS_CO_SUPERVISION (THESIS_PROPOSAL_id, INTERNAL_CO_SUPERVISOR_id,
                                    external_co_supervisor_id, is_external) VALUES (2, 't123', NULL, FALSE);                                        
                                            
 INSERT INTO THESIS_CO_SUPERVISION (THESIS_PROPOSAL_id, INTERNAL_CO_SUPERVISOR_id,
                                    external_co_supervisor_id, is_external) VALUES (2, NULL, 'c125', TRUE);
                                            
 INSERT INTO THESIS_CO_SUPERVISION (THESIS_PROPOSAL_id, INTERNAL_CO_SUPERVISOR_id,
                                    external_co_supervisor_id, is_external) VALUES (3, NULL, 'c126', TRUE); 
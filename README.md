# polito-se2-23-08
Repository for the 01SQNOV - Software Engineering II course - Thesis Management project

## Sequence for running the project on Docker

Before starting the process described below, download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

- Start `Docker Desktop` application.
- Open the local repository of the project using a command line interface (ex. Terminal). Be sure to be inside the `polito-se2-23-08` directory.
- execute :

```sh
 docker-compose up --build
```

- on `Docker Desktop -> Containers` locate the container `polito-se2-23-08`, it should contain three separate images (`db-1`, `backend-1`, `frontend-1` )
- `backend-1` is the container that holds the node.js server application and makes it accessible on `localhost:3000`: it is possible to access the various routes using `Postman` or other tools (this operation is advised to expert only).
- to test changes in the code, the containers must be stopped from `Docker Desktop`, the changes must be performed and saved, then the `command docker-compose up --build` should be used again.
- In order to access the DB (testing purpose) open the Deocker Desktop app, open the db-1 section then switch to Terminal window. Here you can insert the command `psql -U user thesisProposal` to access the DB with username and password. Now you can run and execute your SQL queries.
- ensure that ports 5174 and 3000 are free before executing the application.

## FREE SOFTWARE LICENSE

## MIT LICENSE
**Permissive:** The MIT License is a permissive license that allows users to do anything they want with our code as long as they include the original copyright and license notice in any copy of the software. This aligns well with the collaborative and academic nature of a university project where openness and sharing are crucial.

**Compatibility:** The MIT License is compatible with most other licenses, making it easier for our project to integrate or borrow code from other open-source projects. This is important for incorporating external libraries or components.

**Simple and Clear:** The MIT License is concise and easy to understand, which reduces potential confusion about how the code can be used. This simplicity is beneficial for a university project where diverse individuals with varying levels of legal and licensing understanding may be involved.

**Encourages Collaboration:** The permissive nature of the MIT License encourages collaboration and contributions from others. This is particularly relevant in an academic setting where multiple contributors (students, teachers, and clerks) may be working on the project.

# polito-se2-23-08
Repository for the 01SQNOV - Software Engineering II course - Thesis Management project

## Sequence for running the project on Docker

Before starting the process described below, download [Docker Desktop](https://www.docker.com/products/docker-desktop/)

- start `Docker Desktop`
- execute `docker compose up` from a terminal (inside the polito-se2-23-08 directory) to create a container with the three images (node app, mongoDB server, node test suite)
- on `Docker Desktop -> Containers` locate the container `thesisproposal`, it should contain three separate images (`db-1`, `backend-1`, `frontend-1` )
- `app-1` is the container that holds the node.js application and makes it accessible on `localhost:3000`: it is possible to access the various routes using `Postman` or other tools
- to test changes in the code directly on Docker, all the images present in the container on `Docker Desktop` must be stopped, deleted and then `docker compose up` again
- the two commands must be launched together in this exact order after code changes, or the images will not be built with the new code
- In order to access the DB (testing purpose) open the Deocker Desktop app, open the db-1 section then switch to Terminal window. Here you can insert the command `psql -U user thesisProposal` to access the DB with username and password. Now you can run and execute your SQL queries.
- ensure that ports 27017 and 3000 are free before executing `docker compose -p ezwallet up` with `docker ps`


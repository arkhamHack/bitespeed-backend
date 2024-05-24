**Backend assignment for contact identification for bitespeed**

**Steps to start:**
1. start postgres docker container with the command: docker run -d --name postgres-db -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 postgres:13
2.  Set PORT in env
3.  run yarn start
4.  Endpoint to test http://localhost:PORT/identify
Succesfully identified primary and secondary contacts:

![image](https://github.com/arkhamHack/bitespeed-backend/assets/72064090/6908e2e2-4083-4094-a315-bb5af2fa7d10)

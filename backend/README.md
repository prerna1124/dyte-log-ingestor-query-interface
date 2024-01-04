# Setting Up on localhost

## Move inside backend directory
- `cd backend`

## Before Running Project
We need to have Kafka and MongoDB up and running on local.
- I have `docker-compose.yml` file inside backend directory through which we can run Kafka locally in Docker, run the below command when you are inside backend directory.
- `docker-compose up`
- As a second step, make sure you have MongoDB running locally on `port=27017`

## Start Project

### Run the below command to install all the dependencies
- Run `npm install`
### Run the below command to start the project
- Run `npm run dev`

## Features Implemented:
- Authentication and Authorization
- Log Ingestion
- Query Interface with the following filters:
    - `level`
    - `message`
    - `resourceId`
    - `timestamp`
    - `traceId`
    - `spanId`
    - `commit`
    - `metadata.parentResourceId`
- Implemented Search within Specific Date Ranges [`fromDate` to `toDate`].
- Search combining Multiple Filters.
- Implemented Role-Based Access to Query Interface.
- Used proper indexing to make sure it provides real-time log ingestion and searching capabilities.

## APIs

- ### Sign Up
    - HTTP Method: `POST`
    - Content-Type: `application/json`
    - API Endpoint: `http://localhost:3000/api/users/`
    - Request Body:
    ```json
        {
            "name" : "Prerna",
            "email" : "prerna@gmail.com",
            "password" : "Dyte@24",
            "phone" : "9999999999"
        }
    ```
    - Response Body:
    ```json
        {
            "message": "Signed Up Successfully"
        }
    ```

- ### Login
    - HTTP Method: `POST`
    - Content-Type: `application/json`
    - API Endpoint: `http://localhost:3000/api/users/`
    - Request Body:
    ```json
        {
            "email" : "prerna@gmail.com",
            "password" : "Dyte@24",
        }
    ```
    - Response Body:
    ```json
        {
            "message": "Login Successful."
        }
    ```

- ### Create Logs
    - HTTP Method: `POST`
    - Content-Type: `application/json`
    - API Endpoint: `http://localhost:3000/api/logs/`
    - Request Body: 
    ```json
        {
            "level": "info",
            "message": "Database Connected",
            "resourceId": "server-1234",
            "traceId": "abc-xyz-137",
            "timestamp": "2023-11-21T10:00:00Z",
            "spanId": "span-470",
            "commit": "5e5342f",
            "metadata": {
                "parentResourceId": "server-0987"
            }
        }
    ```
    - Response Body:
    ```json
        {
            "message": "Log is published."
        }
    ```
    
- ### Search Logs
    - HTTP Method: `GET`
    - Content-Type: `application/json`
    - API Endpoint: `http://localhost:3000/api/logs/`
    - Request Headers: You can pass any number of headers, it will combine them and search the logs.
    ```
    | key                       | value                |
    |---------------------------|----------------------|
    | level                     | info                 |
    | message                   | Database Connected   |
    | resourceId                | server-1234          |
    | timestamp                 | 2023-11-17T21:00:00Z |
    | traceId                   | abc-xyz-134          |
    | spanId                    | span-467             |
    | commit                    | 5e5342f              |
    | metadata.parentResourceId | server-0987          |
    | fromDate                  | 2023-11-15T10:50:00Z |
    | toDate                    | 2023-11-16T06:00:00Z | 
    ```
    - Response Body: Array of Log objects
    ```json
        [
            {
                "_id": "65590468bbc22bfdd8b9347a",
                "level": "info",
                "message": "Query Executed",
                "resourceId": "server-1234",
                "traceId": "abc-xyz-134",
                "timestamp": "2023-11-17T21:00:00.000Z",
                "spanId": "span-467",
                "commit": "5e5342f",
                "metadata": {
                    "parentResourceId": "server-0987"
                }
            }
        ]
    ```

## Design Considerations

- Although, the whole system is coded in Monolith Architecture but we can break the system into different services.
- For example, we can have the following services. 
    - `log-service` 
        - This service will take care of log ingesting and querying the data.
    - `authentication-service`
        - This service will take care of authentication and authorization.
- For ease, we have both the services in Monolith framework maintained in separate controllers and services files.

### Log Ingestor:
- The client can be any service which is ingesting logs into the system.
- An http call is made to log-ingestor (`/api/logs`) which produces the data to Kafka topic `logs`.
- A consumer-group is written which has subscribed to the topic `logs`.
- The consumer consumes the data and saves it to `MongoDB`.
- Below is the design flow for ingesting logs into the system.
- We've used `Kafka` here because there will be huge amount of http calls and it's not a good idea to save it to DB directly because of multiple reasons like Performance, I/O Operations, Timeouts, Connections, etc.

![alt text](https://innoskrit-images.s3.ap-south-1.amazonaws.com/log-ingestor.png)

### Querying Interface:
- Assuming only authenticated and authorised users has access to query this data.
- We've implemented Authentication mechanism which has the functionality to login and logout the user.
- We have implemented Authorization mechanism by defining the roles.
- If a user who is an admin is logged in to the system, he will be able to query the data.
- We should be storing the user information in SQL DB like `MySQL` or `PostgreSQL`. But for ease: we, as of now, have stored the user information in `MongoDB` itself just to focus on the core logic of the system.
- Once the authorised user is logged in to the system, he can query the data using the following query parameters:
    - `level`
    - `message`
    - `resourceId`
    - `timestamp`
    - `traceId`
    - `spanId`
    - `commit`
    - `metadata.parentResourceId`
    - `fromDate` to `toDate`

![alt text](https://innoskrit-images.s3.ap-south-1.amazonaws.com/query-interface.png)






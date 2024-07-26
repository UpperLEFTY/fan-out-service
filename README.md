# Fan-Out Service Template

This project implements a fan-out service using Node.js, Express, and Axios for making HTTP requests, along with Redis for distributed caching to optimize performance. The service accepts a single request and fans out to multiple downstream services, aggregating their responses into a single response.


## Features

- **Distributed Caching**: Uses Redis to cache results of expensive operations to avoid redundant processing.
- **Batch Processing**: Combines multiple requests into a single batch if downstream services support batch processing.
- **Parallel Processing**: Processes multiple requests in parallel to improve efficiency.
- **Error Handling**: Handles errors gracefully and returns appropriate error responses.
- **Logging**: Logs important events and errors to help with debugging and monitoring.
- **API Versioning**: Supports multiple versions of the API to allow for backward compatibility.
- **Environment Variables**: Uses environment variables for configuration and sensitive data.
- **Rate Limiting**: Implements rate limiting to prevent abuse and ensure fair usage.
- **Configuration Management**: Uses a configuration file to manage service URLs and other settings.
- **PG Database**: Uses a PostgreSQL database to store data.
- **Unit Testing**: Includes unit tests for business logic and routes using Jest and Supertest. [WIP]
- **Docker Support**: Includes a Dockerfile for containerization and easy deployment. [WIP]


## Project Structure
```
node_modules/
src/
|-- business-logic/
|   |-- fanOutService.js
|-- routes/
|   |-- fanOut.js
|-- services/
|   |-- serviceCaller.js
|-- config/
|   |-- servicesConfig.js
|-- app.js
|-- dbClient.js
|-- redisClient.js
.gitignore
package.json
README.md
``` 

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Redis](https://redis.io/) (running locally or in the cloud)

## Installation

**Clone the Repository:**

   ```sh
    git clone https://github.com/yourusername/fan-out-service.git
   cd fan-out-service
 
2. Install Dependencies:
```sh
npm install
```

### Configuration

Configure the downstream services in `src/config/servicesConfig.js`.

### Running the Application

Start the server:
```sh
npm start
```

The server will run on the port specified in the `PORT` environment variable or default to port 3000.

### API Endpoints

#### POST /v1/fanout

This endpoint accepts a JSON payload and fans out the request to multiple downstream services.

- **URL**: `/v1/fanout`
- **Method**: `POST`
- **Request Body**: JSON object to be sent to downstream services.
- **Response**: Aggregated responses from all downstream services.

#### POST /v2/fanout

This endpoint accepts a JSON payload and fans out the request to multiple downstream services. It includes additional features and improvements over v1.

- **URL**: `/v2/fanout`
- **Method**: `POST`
- **Request Body**: JSON object to be sent to downstream services.
- **Response**: Aggregated responses from all downstream services.

### Example

```sh
# Example for v1
curl -X POST http://localhost:3000/v1/fanout -H "Content-Type: application/json" -d '{"key": "value"}'

# Example for v2
curl -X POST http://localhost:3000/v2/fanout -H "Content-Type: application/json" -d '{"key": "value"}'
```
### Logging

The application uses `winston` for logging. Logs are output to the console and written to `app.log`.

### Error Handling

If any downstream service call fails, the error is logged, and the error message is included in the response.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
```

## Acknowledgments

- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Winston](https://github.com/winstonjs/winston)
```

## Summary

This is a fan-out service implemented using Node.js, Express, and Redis. It fans out requests to multiple downstream services, aggregates their responses, and returns the result to the client. The service includes features such as distributed caching, batch processing, parallel processing, error handling, logging, API versioning, environment variables, rate limiting, configuration management, and unit testing. It uses PostgreSQL for storing data and Redis for caching responses. The service is designed to be modular, extensible, and maintainable to support future enhancements and changes.

-	Modular Design: Code is structured for easy extension and maintenance.
-	Configuration: Allows changes to service URLs and other parameters easily.
-	Database Integration: Uses PostgreSQL for storing and retrieving data.
-	Caching: Implements Redis for caching responses.
-	Rate Limiting: Limits requests to prevent abuse.

## Contact 

For any inquiries or questions, please contact me at upperlefty@zoho.eu
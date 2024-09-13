# Healthcare Application with X-ray Diagnosis

This project is a full-stack application that provides personalized health plans and X-ray diagnosis capabilities. It consists of a React frontend and a Node.js backend, both containerized using Docker for easy development and deployment.

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```
.
├── backend
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── uploads
└── frontend
    ├── public
    ├── src
    ├── package.json
    ├── Dockerfile
    └── tsconfig.json
├── docker-compose.yml
├── .env
└── README.md
```

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   OPENAI_API_KEY=your_api_key_here
   OPENAI_API_ENDPOINT=https://api.openai.com/v1
   OPENAI_MODEL_NAME=gpt-4-vision-preview
   ```
   Replace `your_api_key_here` with your actual OpenAI API key.

3. Ensure that the `uploads` directory exists in the `backend` folder:
   ```
   mkdir -p backend/uploads
   ```

## Running the Application

To start both the frontend and backend services, run the following command in the root directory of the project:

```
docker-compose up --build
```

This command will build the Docker images (if they haven't been built before or if there are changes) and start the containers.

- The frontend will be accessible at `http://localhost:3000`
- The backend will be accessible at `http://localhost:3001`

To stop the application, press `Ctrl+C` in the terminal where docker-compose is running, or run the following command in another terminal:

```
docker-compose down
```

## Development

The Docker Compose configuration uses volume mounts to enable hot-reloading for both frontend and backend during development. This means you can make changes to your code, and the applications will automatically update without needing to rebuild the Docker images.

## API Endpoints

The backend provides the following API endpoints:

1. `POST /api/HealthPlans`: Generates personalized health plans based on user input.
2. `POST /api/xray-diagnosis`: Analyzes X-ray images (or PDFs containing X-ray images) and provides a diagnosis.

Refer to the backend code for detailed information on the required request format and response structure for each endpoint.

## Troubleshooting

- If you encounter permission issues with the `uploads` directory, ensure that the directory has the correct permissions:
  ```
  chmod 777 backend/uploads
  ```

- If the frontend cannot connect to the backend, check that the `REACT_APP_API_URL` in the Docker Compose file is correctly set to `http://backend:3001`.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
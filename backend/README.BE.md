# **IoT Backend API**

This project is a lightweight backend API built with **Express.js** and **MongoDB** to manage objects, doors, IoT
devices, and logs. It includes endpoints for CRUD operations, validation, and testing.

 ---

## **Features**

- **Object Management**: Create, update, delete, and list objects.
- **Door Management**: Manage doors associated with objects.
- **IoT Device Management**: Manage IoT devices linked to doors.
- **Log Management**: Create and list logs for system events.
- **Validation**: Input validation using **Joi**.
- **Testing**: Automated tests using **Jest** and **Supertest**.
- **In-Memory Database**: Tests run on an in-memory MongoDB instance.

 ---

## **Installation**

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash~~~~
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   MONGO_URI=mongodb:localhost:27017/iotBackendDB
   ```

4. Start the server:
   ```bash~~~~
   npm start
   ```

 ---

## **API Endpoints**

### **Auth Endpoints**

| Method | Endpoint    | Description               |
|--------|-------------|---------------------------|
| POST   | `/register` | Register a new user       |
| POST   | `/login`    | Login and receive a token |

### **Building Endpoints**

| Method | Endpoint                        | Description                                         |
|--------|---------------------------------|-----------------------------------------------------|
| GET    | `/buildings`                    | List all buildings (filter by owner)                |
| POST   | `/buildings`                    | Create a new building                               |
| GET    | `/buildings/:id`                | Get building details by ID                          |
| PUT    | `/buildings/:id`                | Update a building                                   |
| DELETE | `/buildings/:id`                | Delete a building                                   |
| GET    | `/buildings/:id/logs`           | Get latest logs for one building (limit & offset)   |
| GET    | `/buildings/logs/recent`        | Get latest logs from all buildings (limit & offset) |
| GET    | `/buildings/available-gateways` | Get gateways not yet connected to a building        |

### **Door Endpoints**

| Method | Endpoint                         | Description                                    |
|--------|----------------------------------|------------------------------------------------|
| GET    | `/buildings/:buildingId/doors`   | List all doors in a building                   |
| GET    | `/doors/:id`                     | Get one door detail                            |
| POST   | `/doors`                         | Create a new door                              |
| PUT    | `/doors/:id`                     | Update an existing door                        |
| DELETE | `/doors/:id`                     | Delete a door                                  |
| POST   | `/doors/:id/toggle-lock`         | Lock/unlock a door                             |
| POST   | `/doors/:id/toggle-state`        | Change door state (e.g., safe → alert)         |
| POST   | `/doors/:id/toggle-favourite`    | Add/remove door from user’s favourites         |
| GET    | `/doors/:id/logs`                | Fetch logs for a door (limit & offset)         |
| GET    | `/devices/available-controllers` | Get available devices not assigned to any door |

### **IoT Device Endpoints**

| Method | Endpoint                         | Description                                       |
|--------|----------------------------------|---------------------------------------------------|
| GET    | `/devices`                       | List all devices (filter by door/gateway/created) |
| GET    | `/devices/:id`                   | Get details of a device                           |
| POST   | `/devices`                       | Create a new device                               |
| PUT    | `/devices/:id`                   | Update a device                                   |
| DELETE | `/devices/:id`                   | Delete a device                                   |
| GET    | `/devices/available-controllers` | Get devices created but not assigned to any door  |

### **Gateway Endpoints**

| Method | Endpoint             | Description                                      |
|--------|----------------------|--------------------------------------------------|
| GET    | `/gateways`          | List gateways (filter by building/owner/created) |
| GET    | `/gateways/:id`      | Get details of a gateway                         |
| POST   | `/gateways`          | Create a new gateway                             |
| PUT    | `/gateways/:id`      | Update a gateway                                 |
| DELETE | `/gateways/:id`      | Delete a gateway                                 |
| POST   | `/gateways/:id/scan` | Start scan to discover available CORE MODULES    |

### **Log Endpoints**

| Method | Endpoint | Description                            |
|--------|----------|----------------------------------------|
| GET    | `/logs`  | List logs (filter by door or severity) |
| POST   | `/logs`  | Create a new log                       |

## **Testing**

Run automated tests to verify the functionality of the API:

1. Run tests:
   ```bash
   npm test
   ```

2. Test coverage includes:

- CRUD operations for objects, doors, IoT devices, and logs.
- Validation errors.
- Integration tests for the complete flow.

 ---

## **Project Structure**

 ```
 ├── config/
 │   └── db.js                # MongoDB connection setup
 ├── dao/
 │   ├── authDao.js           # Data access for auth
 │   ├── buildingDao.js       # Data access for buildings
 │   ├── deviceDao.js         # Data access for IOT devices
 │   ├── doorDao.js           # Data access for doors
 │   ├── gatewayDao.js        # Data access for gateways
 │   └── logDao.js            # Data access for logs
 ├── middleware/
 │   ├── authTokenValidation.js        # Auth token validation middleware
 │   └── validate.js                   # Input validation middleware
 ├── models/
 │   ├── Building.js            # Building schema
 │   ├── Device.js              # IoT device schema
 │   ├── Door.js                # Door schema
 │   ├── Gateway.js             # Gateway schema
 │   ├── Log.js                 # Log schema
 │   └── User.js                # User schema
 ├── routes/
 │   ├── authRoutes.js          # Auth routes
 │   ├── buildingRoutes.js      # Building routes
 │   ├── deviceRoutes.js        # IoT device routes
 │   ├── doorRoutes.js          # Door routes
 │   ├── gatewayRoutes.js       # Gateway routes
 │   ├── logRoutes.js           # Log routes
 │   └── testRoutes.js          # Test routes
 ├── tests/
 │   ├── setup.js             # Test setup with in-memory MongoDB
 │   ├── testServer.js        # Test server configuration
 │   ├── objekt.test.js       # Object endpoint tests
 │   ├── dvere.test.js        # Door endpoint tests
 │   ├── iotNode.test.js      # IoT device endpoint tests
 │   ├── log.test.js          # Log endpoint tests
 │   └── integration.test.js  # Integration tests
 ├── .env                     # Environment variables - not source controlled
 ├── index.js                 # Main server file
 ├── jest.config.js           # Jest configuration
 ├── package.json             # Project metadata and dependencies
 └── README.BE.md             # Backend project documentation
 ```

 ---

## **Technologies Used**

- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **MongoDB**: Database.
- **Mongoose**: ODM for MongoDB.
- **Joi**: Input validation.
- **Jest**: Testing framework.
- **Supertest**: HTTP assertions.
- **MongoDB Memory Server**: In-memory database for testing.

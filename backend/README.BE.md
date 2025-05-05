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

### **Object Endpoints**

| Method | Endpoint         | Description                 |
 |--------|------------------|-----------------------------|
| GET    | `/object`        | List objects with filtering |
| POST   | `/object/create` | Create a new object         |
| PUT    | `/object/update` | Update an existing object   |
| DELETE | `/object/delete` | Delete an object            |

### **Door Endpoints**

| Method | Endpoint                 | Description              |
 |--------|--------------------------|--------------------------|
| GET    | `/object/:objectId/door` | List doors for an object |
| POST   | `/door/create`           | Create a new door        |
| PUT    | `/door/update`           | Update an existing door  |
| DELETE | `/door/delete`           | Delete a door            |

### **IoT Device Endpoints**

| Method | Endpoint         | Description                      |
 |--------|------------------|----------------------------------|
| GET    | `/device`        | List IoT devices                 |
| POST   | `/device/create` | Create a new IoT device (System) |
| PUT    | `/device/update` | Update an existing IoT device    |
| DELETE | `/device/delete` | Delete an IoT device             |

### **Log Endpoints**

| Method | Endpoint      | Description               |
 |--------|---------------|---------------------------|
| GET    | `/logs`       | List logs                 |
| POST   | `/log/create` | Create a new log (System) |

 ---

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
 │   ├── buildingDao.js         # Data access for objects
 │   ├── doorDao.js          # Data access for doors
 │   ├── deviceDao.js        # Data access for IoT devices
 │   └── logDao.js            # Data access for logs
 ├── middleware/
 │   └── validate.js          # Input validation middleware
 ├── models/
 │   ├── Building.js            # Object schema
 │   ├── Door.js             # Door schema
 │   ├── Device.js           # IoT device schema
 │   └── Log.js               # Log schema
 ├── routes/
 │   ├── buildingRoutes.js      # Object routes
 │   ├── doorRoutes.js       # Door routes
 │   ├── deviceRoutes.js     # IoT device routes
 │   └── logRoutes.js         # Log routes
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

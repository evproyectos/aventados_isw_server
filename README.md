# Aventados ISW

## Description
Aventados ISW is an API for a web application that allows users to book trips with drivers. Drivers can create trips to certain destinations, and other users can pay a certain amount to join these trips. 

## Features
- **User Authentication**: Secure authentication for users to sign up and log in.
- **Trip Creation**: Drivers can create trips with specific destinations.
- **Trip Booking**: Users can book available trips and pay the required amount.

## Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express**: Web application framework for Node.js.

## Installation Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aventados-isw.git
   ```
2. **Navigate to the project directory**
   ```bash
   cd aventados-isw
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up environment variables**
   Create a `.env` file in the root directory and add the necessary environment variables:
   ```env
   PORT=3000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```
5. **Run the application**
   ```bash
   npm start
   ```

## Usage
### User Authentication
- **Register**
  - Endpoint: `POST /api/auth/register`
  - Request Body:
    ```json
    {
      "name": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "password123",
      "idNumber": "123456789",
      "birthDate": "1990-01-01",
      "phoneNumber": "1234567890",
      "role": "driver",
      "plate": "ABC123",
      "brand": "Toyota",
      "model": "Corolla",
      "year": "2020"
    }
    ```
  - Response:
    ```json
    {
      "message": "Registration successful"
    }
    ```

- **Log In**
  - Endpoint: `POST /api/auth/login`
  - Request Body:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "your_jwt_token"
    }
    ```

- **Profile**
  - Endpoint: `GET /api/auth/profile`
  - Response:
    ```json
    {
      "message": "Welcome client John"
    }
    ```

- **Update User**
  - Endpoint: `PUT /api/auth/update`
  - Request Body:
    ```json
    {
      "name": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "password": "newpassword123",
      "idNumber": "123456789",
      "birthDate": "1990-01-01",
      "phoneNumber": "1234567890",
      "plate": "XYZ456",
      "brand": "Honda",
      "model": "Civic",
      "year": "2022"
    }
    ```
  - Response:
    ```json
    {
      "message": "User updated successfully"
    }
    ```

- **Delete User**
  - Endpoint: `DELETE /api/auth/delete`
  - Response:
    ```json
    {
      "message": "User deleted successfully"
    }
    ```

### Trip Management
- **Create Trip**
  - Endpoint: `POST /api/trips`
  - Request Body:
    ```json
    {
      "origin": "Location A",
      "destination": "Location B",
      "departureTime": "2023-07-15T10:00:00Z",
      "availableSeats": 3
    }
    ```
  - Response:
    ```json
    {
      "message": "Ride created successfully",
      "ride": {
        "_id": "ride123",
        "driver": "driver123",
        "origin": "Location A",
        "destination": "Location B",
        "departureTime": "2023-07-15T10:00:00Z",
        "availableSeats": 3
      }
    }
    ```

- **Get All Rides**
  - Endpoint: `GET /api/trips`
  - Response:
    ```json
    [
      {
        "_id": "ride123",
        "driver": {
          "_id": "driver123",
          "name": "John Doe"
        },
        "origin": "Location A",
        "destination": "Location B",
        "departureTime": "2023-07-15T10:00:00Z",
        "availableSeats": 3,
        "passengers": []
      }
    ]
    ```

- **Get Ride by ID**
  - Endpoint: `GET /api/trips/:id`
  - Response:
    ```json
    {
      "_id": "ride123",
      "driver": {
        "_id": "driver123",
        "name": "John Doe"
      },
      "origin": "Location A",
      "destination": "Location B",
      "departureTime": "2023-07-15T10:00:00Z",
      "availableSeats": 3,
      "passengers": []
    }
    ```

- **Update Ride**
  - Endpoint: `PUT /api/trips/:id`
  - Request Body:
    ```json
    {
      "origin": "New Location A",
      "destination": "New Location B",
      "departureTime": "2023-07-16T10:00:00Z",
      "availableSeats": 4
    }
    ```
  - Response:
    ```json
    {
      "message": "Ride updated successfully",
      "ride": {
        "_id": "ride123",
        "driver": "driver123",
        "origin": "New Location A",
        "destination": "New Location B",
        "departureTime": "2023-07-16T10:00:00Z",
        "availableSeats": 4
      }
    }
    ```

- **Delete Ride**
  - Endpoint: `DELETE /api/trips/:id`
  - Response:
    ```json
    {
      "message": "Ride deleted successfully"
    }
    ```

- **Book Ride**
  - Endpoint: `POST /api/trips/:id/book`
  - Request Body:
    ```json
    {
      "userId": "user123"
    }
    ```
  - Response:
    ```json
    {
      "message": "Ride booked successfully",
      "ride": {
        "_id": "ride123",
        "driver": "driver123",
        "origin": "Location A",
        "destination": "Location B",
        "departureTime": "2023-07-15T10:00:00Z",
        "availableSeats": 2,
        "passengers": ["user123"]
      }
    }
    ```

## Authors
- **Emanuel Vargas**
- **Melissa Madriz**

## Contact
For any questions or support, please contact us at:
- **Emanuel Vargas**:
- **Melissa Madriz**: 
```

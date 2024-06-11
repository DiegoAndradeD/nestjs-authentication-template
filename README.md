# Nestjs Authentication Template

This is a template for user authentication (SignIn and SignUp) usign the Nestjs framework, with prisma and docker integrations.

## How to run

1. Clone the project in your machine
2. Create a .env file and set the following variables:
    - DATABASE_URL: Prisma url for database connection
    - JWT_SECRET: Secret for Json Web Token
    - POSTGRES_USER: Postgres user for docker
    - POSTGRES_PASSWORD: Postgres password for docker
    - POSTGRES_DB: Postgres database for docker
3. Install the node modules with ```npm install```
4. Up the docker container wiht ```npm run db:dev:up```
5. Create the prisma migrations if they do not exist with ```npm run prisma:dev:migrate```
6. Deploy the migrations to the database with ```npm run prisma:dev:deploy```
7. Start the application with ```npm run start```

## How to customize

### Schemas

The prisma schema is comming with a pre defined User model that can be refactored to suit your needs.

### Dtos

The current dto is set up only with **email** and **password**, that can altered to carry any atributes that you may need.

# Project Strucuture

## AuthModule 

### Description

`AuthModule` is a NestJS module responsible for handling user authentication within the application. It integrates JWT for secure token-based authentication and includes necessary services, controllers, and strategies.

### Imports

- **JwtModule**: Configures the JWT module for the application.
  - **global**: Indicates that this configuration applies globally across the application.
  - **secret**: JWT secret key, retrieved from environment variables (`process.env.JWT_SECRET`).
  - **signOptions**: Options for signing the JWT, including the token expiration time (`expiresIn: '1d'`).

### Providers

- **AuthService**: Service that contains the authentication logic such as user registration and login.
- **JwtStrategy**: Strategy for validating JWT tokens.

### Controllers

- **AuthController**: Controller that defines the authentication endpoints (`signUp`, `login`, `get_user`).

### Configuration

1. **Environment Variables**: Set up the necessary environment variables for the JWT secret.

   Create a `.env` file in the root directory of your project (if it doesn't already exist) and add the following:

   ```env
   JWT_SECRET=your_secret_key_here
   ```

2. **JwtModule**: The JWT module is configured with the secret and token expiration within the `AuthModule`.

### Dependencies

- `AuthService`: Implements the core authentication logic.
- `AuthController`: Defines the endpoints for authentication-related actions.
- `JwtStrategy`: Validates and processes JWT tokens for secure access.

## Auth Controller

### Description

`AuthController` is responsible for managing user authentication within the application. It provides endpoints for user registration, login, and retrieval of authenticated user information.

### Endpoints

#### POST /auth/signUp

Registers a new user.

#### Request

- **Body**: Should contain an object of type `SignUpDto`.

#### Example

```json
{
  "email": "user@example.com",
  "password": "examplePassword"
}
```

#### Response

- **200 OK**: Returns an object with information about the created user or a success message.
- **400 Bad Request**: If the provided data is invalid.

#### POST /auth/login

Authenticates a user and returns a JWT token.

#### Request

- **Body**: Should contain an object with `email` and `password` fields.

#### Example

```json
{
  "email": "user@example.com",
  "password": "examplePassword"
}
```

#### Response

- **200 OK**: Returns an object containing the JWT token.
- **401 Unauthorized**: If the credentials are invalid.

### GET /auth/get_user

Retrieves information about the authenticated user based on the provided JWT token.

#### Request

- **Headers**: Should contain the JWT token in the authorization header `Authorization: Bearer <token>`.

#### Response

- **200 OK**: Returns an object with information about the authenticated user.
- **401 Unauthorized**: If the token is invalid or absent.


The application will be available and ready to receive requests at the documented endpoints.

#### Dependencies

- `AuthService`: Service responsible for authentication logic.
- `SignUpDto`: Data Transfer Object for registering new users.
- `AuthGuard`: JWT authentication guard provided by Passport.

## AuthService

### Description

`AuthService` is a service in a NestJS application responsible for handling authentication logic. It includes methods for user registration, login, and JWT token generation, and interacts with a Prisma database to manage user data.

### Components

#### Dependencies

- **PrismaService**: Service for interacting with the Prisma ORM to manage database operations.
- **JwtService**: Service provided by `@nestjs/jwt` to handle JWT token creation and verification.
- **bcrypt**: Library for hashing passwords.

### Methods

#### signUp(dto: SignUpDto): Promise<any>

Registers a new user by hashing the password, saving the user data to the database, and generating a JWT token.

- **Parameters**: 
  - `dto` (SignUpDto): Data transfer object containing user registration details.

- **Returns**: 
  - An object containing the user data (excluding the password) and a JWT token.

#### login(email: string, password: string): Promise<any>

Authenticates a user by verifying the email and password, and generates a JWT token if the credentials are valid.

- **Parameters**: 
  - `email` (string): The user's email.
  - `password` (string): The user's password.

- **Returns**: 
  - An object containing the user data (excluding the password) and a JWT token.

- **Throws**: 
  - `UnauthorizedException` if the credentials are invalid.

#### getUser(email: string): Promise<any>

Retrieves a user from the database based on the email.

- **Parameters**: 
  - `email` (string): The user's email.

- **Returns**: 
  - An object containing the user data.

#### generateToken(user: any): Promise<string>

Generates a JWT token for the given user.

- **Parameters**: 
  - `user` (any): An object containing the user data.

- **Returns**: 
  - A string representing the JWT token.

## JwtStrategy 

### Description

`JwtStrategy` is a strategy for handling JWT authentication in a NestJS application. It leverages Passport.js to validate JWT tokens and ensures secure access to protected routes by verifying user credentials against the database.

### Components

#### Dependencies

- **PrismaService**: Service for interacting with the Prisma ORM to manage database operations.
- **PassportStrategy**: Base class for creating custom strategies with Passport.js.
- **ExtractJwt, Strategy**: Components from `passport-jwt` used to extract and verify JWT tokens.

#### Configuration

- **jwtFromRequest**: Specifies that the JWT token should be extracted from the Authorization header as a Bearer token.
- **secretOrKey**: JWT secret key, retrieved from environment variables (`process.env.JWT_SECRET`).

### Methods

#### validate(payload: any)

Validates the JWT token payload by checking if the user exists in the database.

- **Parameters**: 
  - `payload` (any): The payload extracted from the JWT token, containing user information such as email.

- **Returns**: 
  - The user object if the user is found.

- **Throws**: 
  - `UnauthorizedException` if the user is not found.

### Usage

#### JWT Token Extraction

The strategy extracts the JWT token from the Authorization header in the format `Bearer <token>`.

#### Validation

1. **Extract Payload**: The `validate` method extracts the email from the payload.
2. **Database Lookup**: It uses `PrismaService` to find the user in the database by email.
3. **Return User**: If the user exists, it returns the user object.
4. **Unauthorized Exception**: If the user does not exist, it throws an `UnauthorizedException`.

## License

This project is licensed under the terms of the MIT license. See the LICENSE file for more details.

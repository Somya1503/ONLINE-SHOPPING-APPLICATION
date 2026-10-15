# Online Shopping Application

A full-stack e-commerce web application built using the MERN stack. The project includes user authentication, product browsing, shopping cart functionality, checkout, order management, and Razorpay Test Mode payment integration.

## Features

- User registration and login
- Browse products and view product details
- Shopping cart management
- Wishlist functionality
- Checkout and order placement
- Razorpay Test Mode payment integration
- Backend payment signature verification
- View order history and order details
- MongoDB database integration

## Technology Stack

**Frontend**
- React
- Vite
- React Router
- Tailwind CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

**Payment Gateway**
- Razorpay Test Mode

## Project Structure

```text
ONLINE-SHOPPING-APPLICATION/
├── client/
│   └── vite-project/
│       ├── public/
│       ├── src/
│       └── package.json
├── server/
│   ├── .env.example
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## Prerequisites

Before running the application, install:

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Razorpay Test Mode API keys

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Somya1503/ONLINE-SHOPPING-APPLICATION.git
cd ONLINE-SHOPPING-APPLICATION
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory. Copy the required variable names from `.env.example` and add your own credentials.

Start the backend:

```bash
npm start
```

### 3. Set Up the Frontend

Open a second terminal from the project root and run:

```bash
cd client/vite-project
npm install
npm run dev
```

Open the local URL displayed in the terminal by Vite, usually `http://localhost:5173`.

## Environment Variables

Configure the following variables in `server/.env`, using the names required by your backend code:

- `PORT` — Backend server port
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret used for JWT authentication
- `RAZORPAY_KEY_ID` — Razorpay Test Mode key ID
- `RAZORPAY_KEY_SECRET` — Razorpay Test Mode secret

Never upload your actual `.env` file or expose your secret keys.

## Payment Testing

This application uses Razorpay Test Mode for testing payment workflows.

- Use Test Mode API credentials.
- Test payments do not charge real money.
- Payment signatures should be verified by the backend.
- Never expose the Razorpay secret key in frontend code.

## Security

- Keep environment variables and credentials private.
- Do not commit `.env` files.
- Do not commit `node_modules` or generated build files.

## Author

Somya

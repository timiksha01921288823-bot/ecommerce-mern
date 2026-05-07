

# API Documentation for Ecommerce Project API with Node.js and Express

Welcome to the documentation for the Ecommerce Project API! This API provides a set of endpoints and functionalities to interact with our eCommerce platform programmatically. With this API, you can build applications, integrations, and automate various tasks related to our online store.

**Base URL**: `http://localhost:5454`

## Environment Variables

Create a `.env` file in the backend root using `.env.example`.

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `SECRET_KEY` - JWT secret for authentication
- `RAZORPAY_KEY_ID` - Razorpay API key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API key secret
- `PAYMENT_CALLBACK_URL` - Frontend callback URL after payment
- `PORT` - API server port

## Authentication

All protected endpoints require the `Authorization` header with a valid token.

## Endpoints

### Update Cart Item

- **URL**: `/api/cart_items/{cartItemId}`
- **Method**: PUT
- **Tags**: cart-item-controller
- **Request Parameters**:
  - `cartItemId` (integer, int64, required)
- **Request Headers**:
  - `Authorization` (string, required)
- **Request Body**:
  ```json
  {
    "$ref": "#/components/schemas/CartItem"
  }
  ```
- **Responses**:
  - 200 OK
    ```json
    {
      "$ref": "#/components/schemas/CartItem"
    }
    ```

### Delete Cart Item

- **URL**: `/api/cart_items/{cartItemId}`
- **Method**: DELETE
- **Tags**: cart-item-controller
- **Request Parameters**:
  - `cartItemId` (integer, int64, required)
- **Request Headers**:
  - `Authorization` (string, required)
- **Responses**:
  - 200 OK
    ```json
    {
      "$ref": "#/components/schemas/ApiResponse"
    }
    ```

### Add Item to Cart

- **URL**: `/api/cart/add`
- **Method**: PUT
- **Tags**: cart-controller
- **Request Headers**:
  - `Authorization` (string, required)
- **Request Body**:
  ```json
  {
    "$ref": "#/components/schemas/AddItemRequest"
  }
  ```
- **Responses**:
  - 200 OK
    ```json
    {
      "$ref": "#/components/schemas/ApiResponse"
    }
    ```

### User Recommendations

- **URL**: `/api/recommendations/user`
- **Method**: GET
- **Tags**: recommendation-controller
- **Request Headers**:
  - `Authorization` (string, required)
- **Description**: Returns personalized product recommendations based on customer order history.
- **Responses**:
  - 200 OK
    ```json
    [
      {
        "$ref": "#/components/schemas/Product"
      }
    ]
    ```

### Product Recommendations

- **URL**: `/api/recommendations/product/{productId}`
- **Method**: GET
- **Tags**: recommendation-controller
- **Request Parameters**:
  - `productId` (string, required)
- **Description**: Returns similar products based on the selected product's category and brand.
- **Responses**:
  - 200 OK
    ```json
    [
      {
        "$ref": "#/components/schemas/Product"
      }
    ]
    ```

### Chatbot Assistant

- **URL**: `/api/chatbot`
- **Method**: POST
- **Tags**: chatbot-controller
- **Request Body**:
  ```json
  {
    "message": "string"
  }
  ```
- **Responses**:
  - 200 OK
    ```json
    {
      "answer": "string"
    }
    ```

... (continue documenting other endpoints)

## Components

### Schemas

- CartItem
- ApiResponse
- AddItemRequest
- Product
- Order
- User
- AuthResponse
- ReviewRequest
- Review
- RatingRequest
- Rating
- PaymentLinkResponse
- Address
- CreateProductRequest
- PageProduct

## Servers

- Server 1:
  - URL: `http://localhost:5454`
  - Description: Generated server URL

## Contact

For any queries or issues, please contact **Ashok Zarmariya** at `ashokzarmariya@gmail.com`.

## License

This API is licensed under **Ashok Zarmariya**.



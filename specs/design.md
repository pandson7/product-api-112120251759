# Technical Design Document

## Architecture Overview

The Product API is a serverless REST API built on AWS using API Gateway, Lambda functions, and DynamoDB. The system follows a microservices architecture pattern with separate Lambda functions for different operations.

## System Components

### API Gateway
- **Purpose**: HTTP endpoint management and request routing
- **Configuration**: REST API with CORS enabled
- **Endpoints**:
  - GET /products - List all products with pagination
  - GET /products/{id} - Get specific product
  - POST /products - Create new product
  - PUT /products/{id} - Update existing product
  - DELETE /products/{id} - Delete product

### Lambda Functions
- **Runtime**: Node.js 18.x
- **Functions**:
  - `getProducts` - Handle GET /products requests
  - `getProduct` - Handle GET /products/{id} requests
  - `createProduct` - Handle POST /products requests
  - `updateProduct` - Handle PUT /products/{id} requests
  - `deleteProduct` - Handle DELETE /products/{id} requests

### DynamoDB Table
- **Table Name**: ProductsTable
- **Primary Key**: productId (String)
- **Attributes**: Flexible JSON schema supporting:
  - productId (required)
  - name (required)
  - category (required)
  - brand (required)
  - description (optional)
  - price (optional)
  - specifications (optional object)
  - createdAt (timestamp)
  - updatedAt (timestamp)

## Data Model

### Product Schema
```json
{
  "productId": "string (UUID)",
  "name": "string",
  "category": "string",
  "brand": "string",
  "description": "string (optional)",
  "price": "number (optional)",
  "specifications": {
    "weight": "string",
    "dimensions": "string",
    "color": "string",
    "material": "string"
  },
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp"
}
```

### Sample Data
The system will include sample products across different categories:
- Electronics (smartphones, laptops)
- Clothing (shirts, shoes)
- Home & Garden (furniture, tools)

## API Design

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "string",
  "timestamp": "ISO 8601"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": []
  },
  "timestamp": "ISO 8601"
}
```

### Pagination
- Query parameters: `limit` (default: 20, max: 100), `lastKey` (for pagination)
- Response includes `nextKey` for subsequent requests

## Infrastructure as Code

### CDK Stack Components
- API Gateway REST API
- Lambda functions with appropriate IAM roles
- DynamoDB table with on-demand billing
- CloudWatch log groups for monitoring

### Deployment
- Single CDK stack deployment
- Environment variables for configuration
- No CI/CD pipeline - direct CDK deployment

## Security Considerations

### IAM Permissions
- Lambda execution roles with minimal DynamoDB permissions
- API Gateway CloudWatch logging permissions

### Input Validation
- JSON schema validation for request bodies
- Parameter validation for path and query parameters
- Sanitization of user inputs

## Monitoring and Logging

### CloudWatch Metrics
- API Gateway request metrics
- Lambda function duration and error rates
- DynamoDB read/write capacity metrics

### Logging Strategy
- Structured JSON logging in Lambda functions
- Request/response logging in API Gateway
- Error tracking and alerting

## Performance Considerations

### DynamoDB Optimization
- On-demand billing mode for variable workloads
- Efficient query patterns using primary key
- Minimal data projection for list operations

### Lambda Optimization
- Connection reuse for DynamoDB client
- Minimal cold start impact with lightweight dependencies
- Appropriate memory allocation (512MB)

## Testing Strategy

### Unit Testing
- Lambda function business logic testing
- Input validation testing
- Error handling scenarios

### Integration Testing
- End-to-end API testing
- DynamoDB integration testing
- Error response validation

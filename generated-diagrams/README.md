# Product API - AWS Architecture Diagrams

This directory contains AWS architecture diagrams generated based on the technical design specifications in `design.md`.

## Generated Diagrams

### 1. Product API Architecture (`product-api-architecture.png`)
- **Purpose**: High-level overview of the serverless architecture
- **Components**: 
  - Client/User interface
  - API Gateway (REST API)
  - 5 Lambda functions (getProducts, getProduct, createProduct, updateProduct, deleteProduct)
  - DynamoDB ProductsTable
  - CloudWatch monitoring
- **Flow**: Left-to-right showing request flow from client through API Gateway to Lambda functions and DynamoDB

### 2. Product API Detailed Flow (`product-api-detailed-flow.png`)
- **Purpose**: Detailed view showing specific API endpoints and data flow
- **Components**:
  - Client Application
  - API Gateway with 5 specific endpoints (GET /products, GET /products/{id}, POST /products, PUT /products/{id}, DELETE /products/{id})
  - Lambda functions with specific roles and Node.js 18.x runtime
  - DynamoDB table with on-demand billing
  - IAM roles with minimal permissions
  - CloudWatch Logs
- **Flow**: Top-to-bottom showing detailed request routing and security/monitoring integration

### 3. Product API Deployment Architecture (`product-api-deployment.png`)
- **Purpose**: Infrastructure deployment view using AWS CDK
- **Components**:
  - Developer workflow
  - CDK Stack (Infrastructure as Code)
  - Deployed AWS services (API Gateway, Lambda functions, DynamoDB, CloudWatch, IAM roles)
- **Flow**: Left-to-right showing deployment process and runtime connections

## Architecture Highlights

### Serverless Design
- **API Gateway**: REST API with CORS enabled for HTTP endpoint management
- **Lambda Functions**: Node.js 18.x runtime with separate functions for each operation
- **DynamoDB**: NoSQL database with on-demand billing and productId as primary key

### Security & Monitoring
- **IAM Roles**: Minimal permissions for Lambda execution with DynamoDB access
- **CloudWatch**: Comprehensive logging and metrics collection
- **Input Validation**: JSON schema validation and parameter sanitization

### Scalability Features
- **On-demand Billing**: DynamoDB scales automatically based on usage
- **Serverless Compute**: Lambda functions scale automatically
- **Pagination Support**: GET /products endpoint supports pagination with limit and lastKey parameters

### Data Model
- **Primary Key**: productId (String UUID)
- **Required Fields**: productId, name, category, brand
- **Optional Fields**: description, price, specifications object
- **Timestamps**: createdAt and updatedAt for audit trail

## File Locations
All diagrams are stored in: `/home/pandson/echo-architect-artifacts/product-api-112120251759/generated-diagrams/generated-diagrams/`

## Technical Implementation
- **Runtime**: Node.js 18.x for all Lambda functions
- **Database**: DynamoDB with flexible JSON schema
- **API**: REST API with standardized response format
- **Deployment**: Single CDK stack with no CI/CD pipeline
- **Memory**: 512MB allocation for Lambda functions

# Product API - AWS Serverless Solution

A complete AWS serverless Product API built with API Gateway, Lambda, and DynamoDB that provides RESTful endpoints for managing product specifications with flexible JSON schemas.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for product management
- **Flexible Schema**: Dynamic JSON attributes support via DynamoDB
- **Serverless Architecture**: Built with AWS Lambda and API Gateway
- **Auto-scaling**: DynamoDB with automatic read/write capacity scaling
- **Pagination**: Configurable pagination with limit and nextKey support
- **CORS Enabled**: Cross-origin resource sharing configured
- **Comprehensive Validation**: Input validation with detailed error messages
- **Sample Data**: Pre-loaded with 6 sample products across different categories

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products with pagination |
| GET | `/products/{id}` | Get specific product by ID |
| POST | `/products` | Create new product |
| PUT | `/products/{id}` | Update existing product |
| DELETE | `/products/{id}` | Delete product by ID |

**Base URL**: `https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/`

## 🏗️ Architecture

### AWS Services
- **API Gateway**: REST API with CORS configuration
- **Lambda Functions**: 5 Node.js 22.x functions for different operations
- **DynamoDB**: ProductsTable112120251759 with auto-scaling
- **CloudWatch**: Logging and monitoring
- **IAM**: Least privilege access roles

### Data Model
```json
{
  "productId": "uuid-string",
  "name": "string (required)",
  "category": "string (required)",
  "brand": "string (required)",
  "description": "string (optional)",
  "price": "number (optional)",
  "specifications": {
    "flexible": "attributes"
  },
  "createdAt": "ISO-8601-timestamp",
  "updatedAt": "ISO-8601-timestamp"
}
```

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured
- Node.js 22.x
- AWS CDK v2

### Deployment
```bash
# Install dependencies
npm install

# Deploy the stack
cdk deploy

# Load sample data
node load-sample-data.js
```

## 📖 API Usage Examples

### Create Product
```bash
curl -X POST "https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Headphones",
    "category": "Electronics",
    "brand": "AudioTech",
    "price": 199.99,
    "description": "Premium wireless headphones with noise cancellation",
    "specifications": {
      "color": "Black",
      "batteryLife": "30 hours",
      "connectivity": "Bluetooth 5.0"
    }
  }'
```

### Get All Products
```bash
curl "https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/products"
```

### Get Products with Pagination
```bash
curl "https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/products?limit=3"
```

### Get Specific Product
```bash
curl "https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/products/{productId}"
```

### Update Product
```bash
curl -X PUT "https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/products/{productId}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product Name",
    "category": "Electronics",
    "brand": "UpdatedBrand",
    "price": 249.99
  }'
```

### Delete Product
```bash
curl -X DELETE "https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/products/{productId}"
```

## 🧪 Testing

The API has been thoroughly tested with:
- ✅ All CRUD operations
- ✅ Input validation scenarios
- ✅ Error handling (404, 400, etc.)
- ✅ Pagination functionality
- ✅ CORS configuration
- ✅ Performance requirements (sub-500ms response times)

## 📁 Project Structure

```
product-api-112120251759/
├── src/
│   └── lambda/           # Lambda function source code
├── cdk-app/             # CDK infrastructure code
├── generated-diagrams/  # Architecture diagrams
├── pricing/            # Cost analysis
├── specs/              # Requirements and design docs
├── tests/              # Test files
├── sample-data.json    # Sample product data
├── load-sample-data.js # Data loading script
└── README.md          # This file
```

## 💰 Cost Analysis

Detailed cost analysis available in `pricing/cost_analysis_report.md`. Expected monthly costs for moderate usage:
- API Gateway: ~$3.50/month
- Lambda: ~$0.20/month
- DynamoDB: ~$1.25/month
- **Total**: ~$5/month for 1M requests

## 🔒 Security

- IAM roles with minimal required permissions
- Input validation for all endpoints
- Sanitized error messages
- CORS properly configured
- No sensitive data exposure in logs

## 📊 Monitoring

- CloudWatch logs for all Lambda functions
- API Gateway access logs
- DynamoDB metrics
- Custom metrics for business KPIs

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build TypeScript
npm run build
```

### CDK Commands
```bash
# Synthesize CloudFormation template
cdk synth

# Deploy stack
cdk deploy

# Destroy stack
cdk destroy
```

## 📈 Performance

- Response times: < 500ms for all endpoints
- Auto-scaling: DynamoDB scales based on demand
- Concurrent executions: Lambda handles up to 1000 concurrent requests
- Pagination: Efficient handling of large datasets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please refer to:
- Project documentation in `specs/` directory
- Architecture diagrams in `generated-diagrams/`
- Cost analysis in `pricing/`

---

**Stack Name**: ProductApiStack112120251759  
**Region**: us-east-1  
**API URL**: https://g7wrfxglr6.execute-api.us-east-1.amazonaws.com/prod/

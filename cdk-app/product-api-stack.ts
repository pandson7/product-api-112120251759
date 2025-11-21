import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class ProductApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const productsTable = new dynamodb.Table(this, 'ProductsTable112120251759', {
      tableName: 'ProductsTable112120251759',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    productsTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    productsTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    // Lambda Functions
    const lambdaProps = {
      runtime: lambda.Runtime.NODEJS_22_X,
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    };

    const getProductsFunction = new lambda.Function(this, 'GetProductsFunction112120251759', {
      ...lambdaProps,
      functionName: 'GetProductsFunction112120251759',
      handler: 'src/lambda/getProducts.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
    });

    const getProductFunction = new lambda.Function(this, 'GetProductFunction112120251759', {
      ...lambdaProps,
      functionName: 'GetProductFunction112120251759',
      handler: 'src/lambda/getProduct.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
    });

    const createProductFunction = new lambda.Function(this, 'CreateProductFunction112120251759', {
      ...lambdaProps,
      functionName: 'CreateProductFunction112120251759',
      handler: 'src/lambda/createProduct.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
    });

    const updateProductFunction = new lambda.Function(this, 'UpdateProductFunction112120251759', {
      ...lambdaProps,
      functionName: 'UpdateProductFunction112120251759',
      handler: 'src/lambda/updateProduct.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
    });

    const deleteProductFunction = new lambda.Function(this, 'DeleteProductFunction112120251759', {
      ...lambdaProps,
      functionName: 'DeleteProductFunction112120251759',
      handler: 'src/lambda/deleteProduct.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../dist')),
    });

    // Grant DynamoDB permissions to Lambda functions
    productsTable.grantReadData(getProductsFunction);
    productsTable.grantReadData(getProductFunction);
    productsTable.grantWriteData(createProductFunction);
    productsTable.grantReadWriteData(updateProductFunction);
    productsTable.grantReadWriteData(deleteProductFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, 'ProductApi112120251759', {
      restApiName: 'ProductApi112120251759',
      description: 'Product API for managing product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // API Resources and Methods
    const products = api.root.addResource('products');
    
    // GET /products
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsFunction));
    
    // POST /products
    products.addMethod('POST', new apigateway.LambdaIntegration(createProductFunction));

    // /products/{id} resource
    const productById = products.addResource('{id}');
    
    // GET /products/{id}
    productById.addMethod('GET', new apigateway.LambdaIntegration(getProductFunction));
    
    // PUT /products/{id}
    productById.addMethod('PUT', new apigateway.LambdaIntegration(updateProductFunction));
    
    // DELETE /products/{id}
    productById.addMethod('DELETE', new apigateway.LambdaIntegration(deleteProductFunction));

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Product API URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: productsTable.tableName,
      description: 'DynamoDB Table Name',
    });
  }
}

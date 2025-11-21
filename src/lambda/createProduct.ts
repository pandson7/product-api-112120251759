import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient, createResponse, validateProduct } from './utils';

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return createResponse(400, { code: 'INVALID_REQUEST', message: 'Request body is required' });
    }

    const productData = JSON.parse(event.body);
    const validationErrors = validateProduct(productData);

    if (validationErrors.length > 0) {
      return createResponse(400, { code: 'VALIDATION_ERROR', message: 'Invalid product data', details: validationErrors });
    }

    const product = {
      ...productData,
      productId: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: product,
    }));

    return createResponse(201, product);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof SyntaxError) {
      return createResponse(400, { code: 'INVALID_JSON', message: 'Invalid JSON in request body' });
    }
    return createResponse(500, { code: 'INTERNAL_ERROR', message: 'Failed to create product' });
  }
};

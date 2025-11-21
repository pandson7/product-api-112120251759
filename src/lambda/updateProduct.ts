import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient, createResponse, validateProduct } from './utils';

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters?.id;

    if (!productId) {
      return createResponse(400, { code: 'INVALID_REQUEST', message: 'Product ID is required' });
    }

    if (!event.body) {
      return createResponse(400, { code: 'INVALID_REQUEST', message: 'Request body is required' });
    }

    const updateData = JSON.parse(event.body);
    const validationErrors = validateProduct(updateData);

    if (validationErrors.length > 0) {
      return createResponse(400, { code: 'VALIDATION_ERROR', message: 'Invalid product data', details: validationErrors });
    }

    // Check if product exists
    const existingProduct = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { productId },
    }));

    if (!existingProduct.Item) {
      return createResponse(404, { code: 'NOT_FOUND', message: 'Product not found' });
    }

    const updatedProduct = {
      ...existingProduct.Item,
      ...updateData,
      productId, // Ensure productId cannot be changed
      updatedAt: new Date().toISOString(),
    };

    await dynamoClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedProduct,
    }));

    return createResponse(200, updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error instanceof SyntaxError) {
      return createResponse(400, { code: 'INVALID_JSON', message: 'Invalid JSON in request body' });
    }
    return createResponse(500, { code: 'INTERNAL_ERROR', message: 'Failed to update product' });
  }
};

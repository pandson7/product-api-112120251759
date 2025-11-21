import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient, createResponse } from './utils';

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters?.id;

    if (!productId) {
      return createResponse(400, { code: 'INVALID_REQUEST', message: 'Product ID is required' });
    }

    // Check if product exists
    const existingProduct = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { productId },
    }));

    if (!existingProduct.Item) {
      return createResponse(404, { code: 'NOT_FOUND', message: 'Product not found' });
    }

    await dynamoClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { productId },
    }));

    return createResponse(200, { message: 'Product deleted successfully', productId });
  } catch (error) {
    console.error('Error deleting product:', error);
    return createResponse(500, { code: 'INTERNAL_ERROR', message: 'Failed to delete product' });
  }
};

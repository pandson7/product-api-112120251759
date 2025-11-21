import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient, createResponse } from './utils';

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const productId = event.pathParameters?.id;

    if (!productId) {
      return createResponse(400, { code: 'INVALID_REQUEST', message: 'Product ID is required' });
    }

    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { productId },
    }));

    if (!result.Item) {
      return createResponse(404, { code: 'NOT_FOUND', message: 'Product not found' });
    }

    return createResponse(200, result.Item);
  } catch (error) {
    console.error('Error getting product:', error);
    return createResponse(500, { code: 'INTERNAL_ERROR', message: 'Failed to retrieve product' });
  }
};

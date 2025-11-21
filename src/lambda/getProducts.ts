import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoClient, createResponse } from './utils';

const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const limit = Math.min(parseInt(event.queryStringParameters?.limit || '20'), 100);
    const lastKey = event.queryStringParameters?.lastKey;

    const scanParams: any = {
      TableName: TABLE_NAME,
      Limit: limit,
    };

    if (lastKey) {
      scanParams.ExclusiveStartKey = { productId: lastKey };
    }

    const result = await dynamoClient.send(new ScanCommand(scanParams));

    const response = {
      products: result.Items || [],
      nextKey: result.LastEvaluatedKey?.productId,
      count: result.Items?.length || 0,
    };

    return createResponse(200, response);
  } catch (error) {
    console.error('Error getting products:', error);
    return createResponse(500, { code: 'INTERNAL_ERROR', message: 'Failed to retrieve products' });
  }
};

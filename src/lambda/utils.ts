import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export interface ApiResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Methods': string;
    'Access-Control-Allow-Headers': string;
  };
  body: string;
}

export function createResponse(statusCode: number, data: any): ApiResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
    body: JSON.stringify({
      success: statusCode < 400,
      data: statusCode < 400 ? data : undefined,
      error: statusCode >= 400 ? data : undefined,
      timestamp: new Date().toISOString(),
    }),
  };
}

export function validateProduct(product: any): string[] {
  const errors: string[] = [];
  
  if (!product.name || typeof product.name !== 'string') {
    errors.push('Product name is required and must be a string');
  }
  
  if (!product.category || typeof product.category !== 'string') {
    errors.push('Product category is required and must be a string');
  }
  
  if (!product.brand || typeof product.brand !== 'string') {
    errors.push('Product brand is required and must be a string');
  }
  
  return errors;
}

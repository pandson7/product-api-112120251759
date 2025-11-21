const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = 'ProductsTable112120251759';

async function loadSampleData() {
  try {
    const sampleData = JSON.parse(fs.readFileSync('sample-data.json', 'utf8'));
    
    console.log(`Loading ${sampleData.length} products into DynamoDB...`);
    
    for (const product of sampleData) {
      const productWithId = {
        ...product,
        productId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await client.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: productWithId,
      }));
      
      console.log(`✓ Loaded product: ${product.name}`);
    }
    
    console.log('✅ All sample data loaded successfully!');
  } catch (error) {
    console.error('❌ Error loading sample data:', error);
    process.exit(1);
  }
}

loadSampleData();

import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getEndedAuctions = async() => {
    const now = new Date();
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName:  'statusAndEndDate',
        KeyConditionExpression: `#status = :status AND endingAt <= :now`,
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now.toISOString()
        },
        ExpressionAttributeNames: { 
            '#status': 'status'
        }  
        // ExpressionAttributeNames is used to define words where # is used in expression
        // # is used to escape the reserverd words, status is a reserved word in aws expression
      }
      const result = await dynamodb.query(params).promise()
      return result.Items
}
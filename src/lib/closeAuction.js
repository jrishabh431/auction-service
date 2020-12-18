import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const closeAuction = async(auction) => {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: `set #status = :status`,
        ExpressionAttributeValues: {
            ':status': 'CLOSED'
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
        // ExpressionAttributeNames is used to define words where # is used in expression
        // # is used to escape the reserverd words, status is a reserved word in aws expression
      }
      const result = await dynamodb.update(params).promise()
      return result
}
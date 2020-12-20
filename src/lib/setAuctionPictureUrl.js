import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient()
export async function setAuctionPictureUrl(id, pictureUrl) {
  // id of the auction and picture url from s3 location
  
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: `set pictureUrl = :pictureUrl`,
    ExpressionAttributeValues: {
        ':pictureUrl': pictureUrl
    },
    ReturnValues: 'ALL_NEW'  //gives the value that's being updated, 
    // Return Values tells dynamodb what to return when the operation is completed
  }

  const result = await dynamodb.update(params).promise()
  return result.Attributes
}

import AWS from 'aws-sdk'
import commonMiddlware from '../lib/commonMiddleware'
import jsonAuctionStatusSchema from '../lib/schemas/getAuctionsSchema'
import createError from 'http-errors'
import validator from '@middy/validator'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getAuctions(event, context) {
  let auctions
  // we will get this qs and will query on it
  const { status } = event.queryStringParameters

  try {
    // with the below we will get all the auctions available, but since scan is costly and we only want
    // to fetch all the open auctions or based on certain status we can use query, it will be cheaper as well

    // const result = await dynamodb
    //   .scan({ TableName: process.env.AUCTIONS_TABLE_NAME })
    //   .promise()
    // auctions = result.Items

    // searching with query
    const params = {
      TableName: process.env.AUCTIONS_TABLE_NAME,
      IndexName: 'statusAndEndDate',
      KeyConditionExpression: `#status = :status`,
      ExpressionAttributeValues: {
        ':status': status,
      },
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    }
    const result = await dynamodb.query(params).promise()
    auctions = result.Items
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  }
}

export const handler = commonMiddlware(getAuctions).use(
  validator({ inputSchema: jsonAuctionStatusSchema, useDefaults: true })
)

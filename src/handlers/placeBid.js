import AWS from 'aws-sdk'
import commonMiddlware from '../lib/commonMiddleware'
import validator from '@middy/validator'
import placeBidSchema from '../lib/schemas/placeBidSchema'
import createError from 'http-errors'
import { getAuctionById } from './getAuction'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function placeBid(event, context) {
  const { id } = event.pathParameters
  const { amount } = event.body
  const {email} = event.requestContext.authorizer

  const auction = await getAuctionById(id);

  if (email === auction.seller){
    throw new createError.Forbidden('You can not bid on your own Auctions!')
  }

  if (email === auction.highestBid.bidder){
    throw new createError.Forbidden('You are already the highest bidder!')
  }

  if(auction.status !== 'OPEN'){
    throw new createError.Forbidden('You cannot bid on closed auctions!')
  }

  if(amount <= auction.highestBid.amount){
      throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`);
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: `set highestBid.amount = :amount, highestBid.bidder = :bidder`,
    ExpressionAttributeValues: {
        ':amount': amount,
        ':bidder': email
    },
    ReturnValues: 'ALL_NEW'  //gives the value that's being updated, 
    // ReturnValues tells dynamodb what to return when the operation is completed
  }
  let updateAuction;
  try {
    const result = await dynamodb.update(params).promise()
    updateAuction = result.Attributes;
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updateAuction),
  }
}

export const handler = commonMiddlware(placeBid).use(validator({inputSchema: placeBidSchema}))

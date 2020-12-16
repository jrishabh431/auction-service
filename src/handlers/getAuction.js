import AWS from 'aws-sdk'
import commonMiddlware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getAuctions(event, context) {
    const { id } = event.pathParameters;
    let auction;
    try {
        const result = await dynamodb
        .get({ TableName: process.env.AUCTIONS_TABLE_NAME, Key: {id} })
        .promise()
        auction = result.Item;
    } catch (error) {
        console.error(error)
        throw new createError.InternalServerError(error)
    }

    if(!auction){
        throw new createError.NotFound({message: `Auction with ${id} not found!`});
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    }
}

export const handler = commonMiddlware(getAuctions)

import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import validator from '@middy/validator'
import createError from 'http-errors'
import cors from '@middy/http-cors'
import JSONErrorHandlerMiddleware from 'middy-middleware-json-error-handler'
import uploadAuctionPictueSchema from '../lib/schemas/uploadAuctionPictueSchema'
import { getAuctionById } from './getAuction'
import { uploadPictureToS3 } from '../lib/uploadPictureToS3'
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl'

async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters
  const auction = await getAuctionById(id)
  const { email } = event.requestContext.authorizer
  if (auction.seller != email) {
    throw new createError.Forbidden('You are not the seller of this auction!')
  }
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')

  try {
    const uploadToS3Result = await uploadPictureToS3(
      auction.id + '.jpg',
      buffer
    )
    console.log(uploadToS3Result)
    const pictureURL = uploadToS3Result.Location

    const updatedAuction = await setAuctionPictureUrl(auction.id, pictureURL)
    return {
      statusCode: 200,
      body: JSON.stringify({ fileURL: pictureURL, updatedAuction }),
    }
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(validator({ inputSchema: uploadAuctionPictueSchema }))
  .use(JSONErrorHandlerMiddleware())
  .use(cors())

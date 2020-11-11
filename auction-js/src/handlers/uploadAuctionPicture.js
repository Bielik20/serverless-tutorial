import httpErrorHandler from '@middy/http-error-handler';
import middy from '@middy/core';
import { getAuctionById } from './getAuction';
import { uploadPictureToS3 } from '../lib/updatedPictureToS3';
import createHttpError from 'http-errors';

async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;
  const auction = await getAuctionById(id);
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  try {
    const result = await uploadPictureToS3(auction.id + '.jpg', buffer);
    console.log(result);
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = middy(uploadAuctionPicture).use(httpErrorHandler);

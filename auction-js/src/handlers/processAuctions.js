import createError from 'http-errors';
import { closeAuction } from '../lib/closeAuction';
import { getEndedAuctions } from '../lib/getEndedAuctions';

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();

    await Promise.all(
      auctionsToClose.map((auction) => closeAuction(auction)),
    );

    return { closed: auctionsToClose.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = processAuctions;

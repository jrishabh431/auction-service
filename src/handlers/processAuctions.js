import createError from 'http-errors'
import { getEndedAuctions } from '../lib/getEndedAuctions'
import { closeAuction } from '../lib/closeAuction'


const processAuctions = async() => {

    try {
        const auctionToClose = await getEndedAuctions();
        const closePromises = auctionToClose.map(auction => closeAuction(auction))
        await Promise.all(closePromises);
        return {closed: closePromises.length} 
    } catch (error) {
        console.log(error)
        throw new createError.InternalServerError(error);
    }
};

export const handler = processAuctions;
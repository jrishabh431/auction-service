import { getEndedAuctions } from '../lib/getEndedAuctions'

const processAuctions = async() => {
    const auctionToClose = await getEndedAuctions();
    console.log(auctionToClose);
};

export const handler = processAuctions;
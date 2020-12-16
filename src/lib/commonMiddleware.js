import middy from '@middy/core';
import httpEventNormalizer from '@middy/http-event-normalizer';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

export default handler => middy(handler).use([
    httpEventNormalizer(), 
    jsonBodyParser(), 
    httpErrorHandler(), 
    cors()
]);

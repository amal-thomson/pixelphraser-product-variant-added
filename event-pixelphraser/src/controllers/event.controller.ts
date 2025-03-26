import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils';

export const post = async (request: Request, response: Response) => {
    try {
        logger.info('Event message received.');

        const pubSubOrg = request.body;
        logger.info('Request Body:', pubSubOrg);

        const pubSubMessage = request.body.message;
        logger.info('Message Body:', pubSubMessage);

        const decodedData = pubSubMessage.data
            ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
            : undefined;

        // logger.info(`Decoded data:' ${decodedData}`);
        if (!decodedData) {
            logger.error('No data found in Pub/Sub message.');
            logger.error('ACK invalid message.');
            return response.status(200).send();
        }

        const jsonData = JSON.parse(decodedData);
        // logger.info('Parsed JSON data from Pub/Sub message.', jsonData);

        if (jsonData.resource?.typeId === 'product') {
            logger.info('Processing event message.');
        }

        const eventTrigger = jsonData.type;
        logger.info(`Event trigger: ${eventTrigger}`);

        response.status(200).send();
        return;

    } catch (error) {
        if (error instanceof Error) {
            logger.error('Error processing request', { error: error.message });
            return response.status(500).send();
        }
        logger.error('Unexpected error', { error });
        return response.status(500).send();
    }
};
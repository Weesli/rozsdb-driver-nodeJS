import got, {Response} from 'got';
import { RequestDetails } from '../types/types';

class DatabaseClient {
    baseUrl: string;
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get(endpoint: string, details: RequestDetails) : Promise<Response> {
        try {
            const response = await got(`${this.baseUrl}${endpoint}`, {
                headers: details.headers,
                method: 'GET',
                responseType: 'json',
            });
            return response;
        } catch (error: any) {
            console.error('GET request failed:', error.response ? error.response.body : error.message);
            throw error;
        }
    }

    async post(endpoint: string, details: RequestDetails) : Promise<Response> {
        try {
            const response = await got(`${this.baseUrl}${endpoint}`, {
                headers: details.headers,
                method: 'POST',
                json: details.body, 
                responseType: 'json', 
            });
            return response;
        } catch (error : any) {
            console.error('POST request failed:', error.response ? error.response.body : error.message);
            throw error;
        }
    }
}

export {
    DatabaseClient
}

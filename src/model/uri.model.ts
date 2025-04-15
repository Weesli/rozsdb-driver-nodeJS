import { UriDetails } from "../types/types";

export class UriDetailsImpl implements UriDetails{
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    public readonly uri: string;

    constructor(uriDetails: UriDetails, collection: string) {
        this.host = uriDetails.host;
        this.port = uriDetails.port;
        this.database = uriDetails.database;
        this.username = uriDetails.username;
        this.password = uriDetails.password;
        this.uri = `http://${this.host}:${this.port}/databases/${this.database}/collections/${collection}`;
    }
}
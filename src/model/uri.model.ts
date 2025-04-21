import { UriDetails } from "../types/types";

export class UriDetailsImpl implements UriDetails{
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;

    constructor(uriDetails: UriDetails) {
        this.host = uriDetails.host;
        this.port = uriDetails.port;
        this.database = uriDetails.database;
        this.username = uriDetails.username;
        this.password = uriDetails.password;
    }
}
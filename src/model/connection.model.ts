import DatabaseClient from "../client/database.client";
import { Collection, Connection, UriDetails } from "../types/types";
import { CollectionImpl } from "./collection.model";

export class ConnectionImpl implements Connection{
    private databaseName: string;
    private uriDetails: UriDetails;
    public client: DatabaseClient;

    constructor(databaseName: string, uriDetails: UriDetails) {
        this.databaseName = databaseName;
        this.uriDetails = uriDetails;
        this.client = new DatabaseClient(uriDetails); // Initialize the client with the URI details
    }

    get getDatabaseName(): string {
        return this.databaseName;
    }

    getCollection(collectionName: string): Collection {
        return new CollectionImpl(collectionName, this);
    }

    get UriDetails(): UriDetails {
        return this.uriDetails;
    }
}
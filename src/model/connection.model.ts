import { Collection, Connection, UriDetails } from "../types/types";
import { CollectionImpl } from "./collection.model";

export class ConnectionImpl implements Connection{
    private databaseName: string;
    private uriDetails: UriDetails;

    constructor(databaseName: string, uriDetails: UriDetails) {
        this.databaseName = databaseName;
        this.uriDetails = uriDetails;
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
import { DatabaseClient } from "../client/database.client";
import { Collection, CollectionActionType, Connection, DatabaseObject } from "../types/types";
import { UriDetailsImpl } from "./uri.model";
import { send } from "../util/request.utils";
import { DatabaseObjectImpl } from "./object.model";

export class CollectionImpl implements Collection {

    private name: string;
    private connection: Connection;
    private client: DatabaseClient;

    constructor(name: string, connection: Connection) {
        this.name = name;
        this.connection = connection;
        const uriDetails = new UriDetailsImpl(connection.UriDetails, name); // with format and ready for use uri
        this.client = new DatabaseClient(uriDetails.uri); // start the client with this collection uri
    }

    get getName(): string {
        return this.name;
    }

    async connect(): Promise<Connection> {
        const response =  await send(this.client, this, this.connection, CollectionActionType.CONNECTION, {headers: {}, body: '', paths: [], hasBody: false})
        if (response?.statusCode !== 200) {
            throw new Error(`Failed to connect to collection ${this.name}: ${response?.statusMessage}`);
        } // connect and read collection
        return this.connection!;
    }

    async insertOrUpdate(data: string, id: string | undefined): Promise<DatabaseObject> {
        let body = {
            id: id ? id : '',
            data: data
        }
        const response = await send(this.client, this, this.connection, CollectionActionType.INSERTORUPDATE, {headers: {}, body: JSON.stringify(body), paths: [], hasBody: true});
        if (response?.statusCode !== 200) {
            throw new Error(`Failed to insert or update data in collection ${this.name}: ${response?.statusMessage}`);
        }
        const responseBody = response?.body as { message: string};
        return DatabaseObjectImpl.fromData(responseBody, this); // Assuming the response contains the inserted or updated object
    }

    async delete(id: string): Promise<boolean> {
        const response = await send(this.client, this, this.connection, CollectionActionType.DELETE, {headers: {}, body: JSON.stringify({
            id: id
        }), paths: [], hasBody: true});
        if (response?.statusCode !== 200) {
            throw new Error(`Failed to delete data in collection ${this.name}: ${response?.statusMessage}`);
        }
        const status = response?.body as { status: string};
        return status.status === 'success';
    }

    async findAll(): Promise<DatabaseObject[]> {
        const response = await send(this.client, this, this.connection, CollectionActionType.FINDALL, {headers: {}, body: '', paths: [], hasBody: false});
        if (response?.statusCode !== 200) {
            throw new Error(`Failed to find all data in collection ${this.name}: ${response?.statusMessage}`);
        }
        const responseBody = response?.body as { message: any[]};
        return await Promise.all(responseBody.message.map(async obj => await DatabaseObjectImpl.fromData(obj, this))); 
    }

    async findById(id: string): Promise<DatabaseObject> {
        const response = await send(this.client, this, this.connection, CollectionActionType.FINDBYID, {headers: {}, body: JSON.stringify({
            id: id
        }), paths: [], hasBody: true});
        if (response?.statusCode !== 200) {
            throw new Error(`Failed to find data by ID in collection ${this.name}: ${response?.statusMessage}`);
        }
        const responseBody = response?.body as { message: any};
        return DatabaseObjectImpl.fromData(responseBody.message, this);
    }

    async find(where: string, value: string): Promise<DatabaseObject[]> {
        const response = await send(this.client, this, this.connection, CollectionActionType.FIND, {headers: {}, body: JSON.stringify({
            field: where,
            value: value
        }), paths: [], hasBody: true});
        if (response?.statusCode !== 200) {
            throw new Error(`Failed to find data in collection ${this.name}: ${response?.statusMessage}`);
        }
        const responseBody = response?.body as { message: any[]};
        return await Promise.all(responseBody.message.map(async obj => await DatabaseObjectImpl.fromData(obj, this)));
    }
    
}
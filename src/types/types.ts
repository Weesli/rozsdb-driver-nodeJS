import DatabaseClient from "../client/database.client";

export interface UriDetails {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

export interface Collection {
    connect(): Promise<Collection>;
    getName: string;
    insertOrUpdate(data: string, id: string | undefined): Promise<DatabaseObject>;
    delete(id: string): Promise<boolean>;
    findAll(): Promise<DatabaseObject[]>;
    findById(value: string): Promise<DatabaseObject>;
    find(where: string, value: string): Promise<DatabaseObject[]>;
  }
  

export interface Connection {
    client: DatabaseClient,
    getDatabaseName: string;
    getCollection: (collectionName: string) => Collection;
    UriDetails: UriDetails;
}

export interface DatabaseObject {
    id: string;
    object: string;
    collection: Collection;
    save: () => Promise<void>;
    delete: () => Promise<boolean>;
}

export interface RequestDetails {
    headers: Record<string, string>;
    body: any;
    paths: string[];
    hasBody: boolean;
}
export enum CollectionActionType {
    CONNECTION = "connection",
    INSERTORUPDATE = "insertorupdate",
    FINDALL = "findall",
    FINDBYID = "findbyid",
    FIND = "find",
    DELETE = "delete"
}
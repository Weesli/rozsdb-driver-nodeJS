export interface UriDetails {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

export interface Collection {
    getName: string;
    connect: () => Promise<Connection>;
    insertOrUpdate: (data: string, id?: string) => Promise<DatabaseObject>;
    delete: (id: string) => Promise<boolean>;
    findAll: () => Promise<DatabaseObject[]>;
    findById: (id: string) => Promise<DatabaseObject>;
    find: (where: string, value: string) => Promise<DatabaseObject[]>;
}

export interface Connection {
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
    CONNECTION = "CONNECTION",
    INSERTORUPDATE = "INSERTORUPDATE",
    FINDALL = "FINDALL",
    FINDBYID = "FINDBYID",
    FIND = "FIND",
    DELETE = "DELETE"
}
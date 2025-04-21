import { DatabaseClient } from "../client/database.client";
import { Collection, CollectionActionType, Connection, DatabaseObject } from "../types/types";
import { DatabaseObjectImpl } from "./object.model";

    export class CollectionImpl implements Collection {

        private name: string;
        private connection: Connection;
        private client: DatabaseClient;

        constructor(name: string, connection: Connection) {
            this.name = name;
            this.connection = connection;
            this.client = connection.client; // get the client from the connection
            this.client.connect().then(() => {
                console.log(`Connected to ${this.name} collection`);
            }).catch((err) =>{
                console.error(`Error connecting to ${this.name} collection: ${err}`);
            }); // connect to the database
        }
        async connect(): Promise<Collection> {
            const response = await this.client.send(CollectionActionType.CONNECTION, this.name, {});
            if (response.status === "success") {
                return this;
            } else {
                throw new Error(`Failed to connect to ${this.name} collection: ${response.message}`);
            }
        }
        insertOrUpdate(data: string, id: string | undefined): Promise<DatabaseObject> {
            const object: any = {
                data: data,
            };
            if (id !== undefined) {
                object.id = id;
            }
            const json = JSON.stringify(object);
            return new Promise((resolve, reject) => {
                this.client.send(CollectionActionType.INSERTORUPDATE, this.name, json).then((response) => {
                    if (response.status === "success") {
                        
                    } else {
                        reject(new Error(`Failed to insert or update data: ${response.message}`));
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        }
        delete(id: string): Promise<boolean> {
            const object: any = {
                id: id,
            }
            const json = JSON.stringify(object);
            return new Promise((resolve, reject) => {
                this.client.send(CollectionActionType.DELETE, this.name, json).then((response) => {
                    if (response.status === "success") {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        }
        findAll(): Promise<DatabaseObject[]> {
            return new Promise((resolve, reject) => {
                this.client.send(CollectionActionType.FINDALL, this.name, {}).then((response) => {
                    if (response.status === "success") {
                        const objects = solveResponse(response, this);
                        resolve(objects);
                    } else {
                        reject(new Error(`Failed to find data: ${response.message}`));
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        }
        findById(value: string): Promise<DatabaseObject> {
            const object: any = {
                id: value,
            }
            const json = JSON.stringify(object);
            return new Promise((resolve, reject) => {
                this.client.send(CollectionActionType.FINDBYID, this.name, object).then((response) => {
                    if (response.status === "success") {
                        const objects = solveResponse(response, this);
                        objects.then((objects) => {
                            if (objects.length > 0) {
                                resolve(objects[0]);
                            }
                        }
                        ).catch((err) => {
                            reject(new Error(`Failed to process data items: ${err.message}`));
                        }
                        );
                    } else {
                        reject(new Error(`Failed to find data by id: ${response.message}`));
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        }
        find(where: string, value: string): Promise<DatabaseObject[]> {
            const object: any = {
                where: where,
                value: value,
            }
            const json = JSON.stringify(object);
            return new Promise((resolve, reject) => {
                this.client.send(CollectionActionType.FIND, this.name, json).then((response) => {
                    if (response.status === "success") {
                        const objects = solveResponse(response, this);
                        resolve(objects);
                    } else {
                        reject(new Error(`Failed to find data: ${response.message}`));
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        }

        get getName(): string {
            return this.name;
        }
        
    }

const solveResponse = (response: any, collection: Collection): Promise<DatabaseObject[]> => {
    const responseData = response.message as string;
    const content = responseData.trim().replace(/^\[|\]$/g, '');
    
    if (content.trim() !== "") {
        const items = content.split(",").map(item => item.trim());
        
        const objectPromises = items.map(item => DatabaseObjectImpl.fromData(item, collection));
        return Promise.all(objectPromises);
    } else {
        return Promise.resolve([]);
    }
}
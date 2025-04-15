import { Collection, Connection } from "../types/types";

export const getCollection = (connection: Connection, collectionName: string): Collection | null => {
    return connection.getCollection(collectionName);
}
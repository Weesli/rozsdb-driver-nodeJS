import { UriDetails } from "../types/types";

export const getUriDetails = (uri: string):  UriDetails => {
    const parts: [string, string, number, string, string, string] = uri.split(":") as [string, string, number, string, string, string];
    const host = parts[1];
    const port = parts[2];
    const database = parts[3];
    const username = parts[4];
    // if check is password part is empty
    const password = parts[5];
    return {
        host,
        port,
        database,
        username,
        password
    };
}
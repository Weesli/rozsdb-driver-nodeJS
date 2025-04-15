import { ConnectionImpl } from "../model/connection.model";
import { Connection } from "../types/types";
import { getUriDetails } from "../util/uri.util";

export const getConnection = (connectionString: string) : Connection => {
    const uriDetails = getUriDetails(connectionString);
    return new ConnectionImpl(uriDetails.database, uriDetails);
}
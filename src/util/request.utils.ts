import { DatabaseClient } from "../client/database.client";
import { Collection, Connection, RequestDetails, CollectionActionType } from "../types/types";
import { Response } from "got";

export const send = async (
  client: DatabaseClient,  
  collection: Collection,
  connection: Connection,
  type: CollectionActionType,
  details: RequestDetails
): Promise<Response | null> => {
  return await requestBuilder(client, collection, connection, type, details);
};

const requestBuilder = async (
  client: DatabaseClient,
  collection: Collection,
  connection: Connection,
  type: CollectionActionType,
  details: RequestDetails
): Promise<Response> => {
  const typeName = typeConverter(type);

  const headers: Record<string, string> = {
    admin: `${connection.UriDetails.username}=${connection.UriDetails.password}`,
    ...details.headers
  };
  details.headers = headers;

  const endpoint = getPath(type, connection);
  if (typeName === "GET") {
    return await client.get(endpoint, details);
  } else {
    return await client.post(endpoint, details);
    }
};
const typeConverter = (type: CollectionActionType): "GET" | "POST" => {
  return type.toString() === "CONNECTION" ? "GET" : "POST";
};
const getPath = (type: CollectionActionType, connection: Connection): string => {
  let path = "";

  switch (type.toString()) {
    case "INSERTORUPDATE":
      path = "insertorupdate";
      break;
    case "DELETE":
      path = "delete";
      break;
    case "FIND":
      path = "find";
      break;
    case "FINDALL":
      path = "findall";
      break;
    case "FINDBYID":
      path = "findbyid";
      break;
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
  return `/${path}`;
};

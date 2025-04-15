import { Collection, DatabaseObject } from "../types/types";
import { decompress } from "../util/compress.util";

export class DatabaseObjectImpl implements DatabaseObject {
    id: string;
    object: string;
    collection: Collection;

    constructor(id?: string, object?: string, collection?: Collection) {
        this.id = id || '';
        this.object = object || '';
        this.collection = collection || {} as Collection;
    }

    save = async () =>{
        await this.collection.insertOrUpdate(this.object, this.id)
    }

    delete = async (): Promise<boolean> => {
        const status = await this.collection.delete(this.id);
        return status;
    }
    


    static async fromData(src: any, collection: Collection): Promise<DatabaseObjectImpl> {
        const compressedData = Buffer.from(src, 'base64');
        try {
          const decompressedData = await decompress(compressedData);
          const decompressedString = decompressedData.toString();
          const decompressedObject = JSON.parse(decompressedString);
          
          const id = decompressedObject['$id'] as string;
          delete decompressedObject['$id'];
    
          const object = new DatabaseObjectImpl(id, decompressedObject, collection);
          return object;
        } catch (error) {
          console.error("Decompression failed:", error);
          throw new Error("Decompression or parsing failed.");
        }
      }
      

}
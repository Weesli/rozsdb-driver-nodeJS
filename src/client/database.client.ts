import net from 'net';
import { CollectionActionType, UriDetails } from '../types/types';

class DatabaseClient {

    private client: net.Socket | null = null;
    private uriDetails: UriDetails;
    
    constructor(UriDetails: UriDetails) {
        this.uriDetails = UriDetails;
        this.connect().then(() => {
        }).catch((err) => {
            console.error(`Error connecting to ${this.uriDetails.host}:${this.uriDetails.port}: ${err}`);
        });
    }
    
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
        this.client = net.createConnection({ host: this.uriDetails.host, port: this.uriDetails.port }, () => {
            resolve();
        });
    
        this.client.on('error', (err) => {
            reject(err);
        });
        });
    }

    send(
        type: CollectionActionType,
        collection: string,
        data: any,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.client) {
                return reject(new Error('Client is not connected'));
            }
            const messageObj = {
                action: type.toString(),
                database: this.uriDetails.database,
                collection,
                user: `${this.uriDetails.username}=${this.uriDetails.password}`,
                object: data,
            };
    
            const json = Buffer.from(JSON.stringify(messageObj), 'utf-8');
            const lengthPrefix = intToBuffer(json.length);
            const fullMessage = Buffer.concat([lengthPrefix, json]);
    
            this.client.write(fullMessage, async (err) => {
                if (err) return reject(err);
    
                try {
                    const responseBuffer = await readLengthPrefixedData(this.client!);
                    const response = JSON.parse(responseBuffer.toString('utf-8'));
                    resolve(response);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
function intToBuffer(num: number): Buffer {
    const buffer = Buffer.alloc(4);
    buffer.writeInt32BE(num, 0);
    return buffer;
}

function readLengthPrefixedData(socket: net.Socket): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let totalLength = -1;
        let chunks: Buffer[] = [];
        let received = 0;

        const onData = (data: Buffer) => {
            chunks.push(data);
            received += data.length;

            let buffer = Buffer.concat(chunks);

            if (totalLength === -1 && buffer.length >= 4) {
                totalLength = buffer.readInt32BE(0);
            }

            if (totalLength !== -1 && buffer.length >= totalLength + 4) {
                socket.removeListener('data', onData);
                resolve(buffer.subarray(4, 4 + totalLength));
            }
        };

        socket.on('data', onData);
        socket.on('error', reject);
    });
}

export default DatabaseClient;
export { DatabaseClient };
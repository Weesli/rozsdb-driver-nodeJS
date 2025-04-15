import { Encoder, Decoder } from "@toondepauw/node-zstd";

const COMPRESSION_LEVEL = 3;

const encoder = new Encoder(COMPRESSION_LEVEL);
const decoder = new Decoder();


export async function compress(data: Buffer): Promise<Buffer> {
  return encoder.encode(data);
}

export async function decompress(data: Buffer): Promise<Buffer> {
  return decoder.decode(data);
}
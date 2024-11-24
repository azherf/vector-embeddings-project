import { DataAPIClient, Collection, Db } from "@datastax/astra-db-ts";
import dotenv from "dotenv";
import { Movie } from "./types";

dotenv.config();

const astraClient = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN!);
const db = astraClient.db(process.env.ASTRA_DB_API_ENDPOINT!);

export async function initCollection(): Promise<Collection<Movie>> {
  let collection: Collection<Movie>;
  try {
    collection = await db.collection<Movie>("movies");
  } catch (error: any) {
    if (error.name === "CollectionNotFoundError") {
      collection = await db.createCollection<Movie>("movies", {
        vector: {
          dimension: 1536,
          metric: "cosine"
        }
      });
    } else {
      throw error;
    }
  }
  return collection;
}
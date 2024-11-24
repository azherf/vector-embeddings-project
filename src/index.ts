import { DataAPIClient, VectorDoc, Collection } from '@datastax/astra-db-ts';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const astraClient = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN!);
const db = astraClient.db(process.env.ASTRA_DB_API_ENDPOINT!);

(async () => {
    const colls = await db.listCollections();
    console.log('Connected to AstraDB:', colls);
  })();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Movie extends VectorDoc {
  title: string;
  description: string;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

async function main() {
  let collection: Collection<Movie>;
  collection = await db.collection<Movie>('movies');
  if (!collection) {
  // Create a collection
  collection = await db.createCollection<Movie>('movies', {
    vector: {
      dimension: 1536,
      metric: 'cosine'
    }
  });

  console.log("Collection created");
}

  // Insert a document with embedding
  const movieDescription = "A classic sci-fi adventure about time travel and family.";
  const embedding = await generateEmbedding(movieDescription);

  await collection.insertOne({
    title: "Back to the Future",
    description: movieDescription,
    $vector: embedding
  });

  console.log("Document inserted");

  // Perform a vector search
  const searchDescription = "Time travel movie";
  const searchEmbedding = await generateEmbedding(searchDescription);

  const searchResults = await collection.find({
    $vector: searchEmbedding
  }, {
    limit: 1,
    sort: { $vector: searchEmbedding }
  });

  console.log("Search results:", searchResults);
}

main().catch(console.error);
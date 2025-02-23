import { OpenAI } from "openai";
import dotenv from "dotenv";
import readline from 'readline';
import { generateEmbedding } from "./utils";
import { initCollection } from "./collection";
import { fetchMovies, searchMovies } from "./movies";

dotenv.config();

async function main() {
  
  // Initialize the collection
  const collection = await initCollection();
  console.log("Collection created", collection);
  console.log("Collection name:", collection.name);
// }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Insert a document with embedding
  // const movieDescription = "A classic sci-fi adventure about time travel and family.";
  // let movies = await fetchMovies();
  // console.log("Movies fetched:", movies);
  // movies.forEach(async (movie) => {
  //   const embedding = await generateEmbedding(openai, movie.description);
  //   await collection.insertOne({
  //     title: movie.title,
  //     description: movie.description,
  //     $vector: embedding
  //   });
  // });

  let movies = await fetchMovies();
  movies = await Promise.all(movies.map(async (movie) => {
    const embedding = await generateEmbedding(openai, movie.description);
    return {
      title: movie.title,
      description: movie.description,
      $vector: embedding
    };
  }));

  await collection.insertMany(movies);
  console.log("Documents inserted");


  // Perform a text search
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Enter a movie description to search: ', (answer) => {
    searchMovies(answer, openai, collection).then(() => rl.close());
  });
}

main().catch(console.error);
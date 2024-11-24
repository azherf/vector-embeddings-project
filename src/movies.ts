import { Collection } from "@datastax/astra-db-ts";
import axios from "axios";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { Movie } from "./types";
import { generateEmbedding } from "./utils";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function fetchMovies(): Promise<Movie[]> {
  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
        page: 1,
      },
    }
  );
  return response.data.results.map((movie: any) => ({
    title: movie.title,
    description: movie.overview,
  }));
}

export async function searchMovies(description: string, openai: OpenAI, collection: Collection<Movie>): Promise<void> {
  const searchEmbedding = await generateEmbedding(openai, description);

  const movies = await collection.find({}, {
    limit: 5,
    sort: { $vector: searchEmbedding }
  }).toArray();

  console.log("Search results:");
  movies.forEach((movie) => {
    console.log(`Title: ${movie.title}`);
  });

}
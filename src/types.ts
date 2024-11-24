import { VectorDoc } from "@datastax/astra-db-ts";

export interface Movie extends VectorDoc {
  title: string;
  description: string;
}
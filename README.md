This is a simple project that fetches movies from `TMDb`, creates vector embeddings for them using `Open API`, stores them in `DataStax Astra`, and then searches the movies that user gives as an input on the terminal.

- For this you will need the following API Keys inside your `.env` file

```
ASTRA_DB_APPLICATION_TOKEN="<Your_Token>" #AstraCS
ASTRA_DB_API_ENDPOINT="<Your_Endpoint>"
OPENAI_API_KEY="<Your_Key>"
TMDB_API_KEY="<Your_Key>"
```

Once you are set then run the following commands

```
npm install
npx ts-node src/index.ts
```

later, On the terminal, input a title to search.



import { Hono } from "hono";
import { env } from "hono/adapter";

const movies = new Hono()

  // Search
  .get("/search", async (c) => {
    const { query, page } = c.req.query();
    const { CONSUMET_API } = env<{ CONSUMET_API: string }>(c);

    const apiUrl = `${CONSUMET_API}/movies/flixhq/${query}?page=${page}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return c.json(data);
    } catch (error) {
      console.error("Fetch error:", error);
      return c.json({ error: "Failed to fetch data" }, 500);
    }
  })

  // Server
  .get("/server", async (c) => {
    const { episodeId, mediaId } = c.req.query();
    const { CONSUMET_API } = env<{ CONSUMET_API: string }>(c);

    const apiUrl = `${CONSUMET_API}/movies/flixhq/servers?episodeId=${episodeId}&mediaId=${mediaId}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return c.json(data);
    } catch (error) {
      console.error("Fetch error:", error);
      return c.json({ error: "Failed to fetch data" }, 500);
    }
  })

  // Source
  .get("/source", async (c) => {
    const { episodeId, mediaId, server } = c.req.query();
    const { CONSUMET_API } = env<{ CONSUMET_API: string }>(c);

    const apiUrl = `${CONSUMET_API}/movies/flixhq/watch?episodeId=${episodeId}&mediaId=${mediaId}&server=${server}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return c.json(data);
    } catch (error) {
      console.error("Fetch error:", error);
      return c.json({ error: "Failed to fetch data" }, 500);
    }
  })

  // Country
  .get("/country", async (c) => {
    const { code, page } = c.req.query();
    const { CONSUMET_API } = env<{ CONSUMET_API: string }>(c);

    const apiUrl = `${CONSUMET_API}/movies/flixhq/country/${code}?page=${page}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return c.json(data);
    } catch (error) {
      console.error("Fetch error:", error);
      return c.json({ error: "Failed to fetch data" }, 500);
    }
  })

  // Genre
  .get("/genre", async (c) => {
    const { name, page } = c.req.query();
    const { CONSUMET_API } = env<{ CONSUMET_API: string }>(c);

    const apiUrl = `${CONSUMET_API}/movies/flixhq/genre/${name}?page=${page}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return c.json(data);
    } catch (error) {
      console.error("Fetch error:", error);
      return c.json({ error: "Failed to fetch data" }, 500);
    }
  });

export default movies;

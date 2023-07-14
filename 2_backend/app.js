const express = require("express");
const app = express();

const cors = require("cors");
const pool = require("./db.js");

// Middleware
app.use(cors());
app.use(express.json());

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

// Routes
// register | login
app.post("/api/users", async (req, res) => {
  try {
    const { name, password, type } = req.body;

    if (type === "login") {
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE name = $1 AND password = $2",
        [name, password]
      );
      if (existingUser.rows.length > 0) {
        return res.status(200).json("Logged in");
      } else {
        return res.json("Incorrect username or password");
      }
    } else if (type === "register") {
      // Check if the username is taken
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE name = $1",
        [name]
      );
      if (existingUser.rows.length > 0) {
        return res.json("Username already exists");
      }
      // If not, create user
      const newUser = await pool.query(
        "INSERT INTO users (name, password) VALUES($1, $2) RETURNING *",
        [name, password]
      );
      res.status(201).send("Logged in");
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Internal Server Error");
  }
});

// -- GET - get all usernames
app.get("/api/users", async (_req, res) => {
  try {
    const query = `
  SELECT name
  FROM users
  WHERE favorited_movies IS NOT NULL AND array_length(favorited_movies, 1) > 0
`;
    const result = await pool.query(query);

    const usernames = result.rows.map((row) => row.name);
    res.status(200).json(usernames);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Internal Server Error");
  }
});

// -- GET - get user favorited movies
app.get("/api/users/:name", async (req, res) => {
  try {
    const { name } = req.params;

    const user = await pool.query(
      "SELECT favorited_movies FROM users WHERE name = $1",
      [name]
    );
    const { favorited_movies } = user.rows[0];

    res.status(200).json(favorited_movies);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

// -- PUT - Add a movie
app.put("/api/users/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { title, poster_path, overview, release_date, vote_average } =
      req.body;

    const movie = {
      title,
      poster_path,
      overview,
      release_date,
      vote_average,
    };

    const user = await pool.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);

    const favoritedMovies = user.rows[0].favorited_movies || [];

    // Check if the movie already exists
    const movieExists = favoritedMovies.find(
      (favMovie) => favMovie.title === movie.title
    );

    if (movieExists) {
      return res.json("Movie already exists in favorited movies list");
    }
    // If not, add movie
    const updateUser = await pool.query(
      "UPDATE users SET favorited_movies = COALESCE(favorited_movies, ARRAY[]::JSONB[]) || ARRAY[($1)::JSONB] WHERE name = $2",
      [JSON.stringify(movie), name]
    );
    res.status(200).json("Movie Added");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Internal Server Error");
  }
});

// -- DELETE - delete a movie
app.delete("/api/users/:name/movies/:title", async (req, res) => {
  try {
    const { name, title } = req.params;

    // Check if user exists
    const checkUser = await pool.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json("User not found");
    }

    // Find the index of the movie using title
    const user = checkUser.rows[0];
    const movieIndex = user.favorited_movies.findIndex(
      (movie) => movie.title === title
    );

    // If found, remove movie
    if (movieIndex !== -1) {
      user.favorited_movies.splice(movieIndex, 1);

      // Update the user in the database with the modified favorited_movies array
      const updateUser = await pool.query(
        "UPDATE users SET favorited_movies = $1 WHERE name = $2",
        [user.favorited_movies, name]
      );
      return res.json("Movie was removed from favorited movies list");
    }
    return res.json("Movie not found in favorited movies list");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Internal Server Error");
  }
});

// Requests that are not connected with client
app.get("/api/usersT", async (_req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");

    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Internal Server Error");
  }
});

app.delete("/api/usersT/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await pool.query("DELETE FROM users WHERE id = $1", [
      id,
    ]);

    res.json("User was deleted");
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Internal Server Error");
  }
});

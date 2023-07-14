import axios from "axios";

const HOST = "http://localhost:5000";

class API {
  // create user
  async signup(userData) {
    const { data } = await axios.post(HOST + "/api/users", userData);

    return data;
  }
  // get ALL users
  async getUsers() {
    const { data } = await axios.get(HOST + "/api/users");

    return data;
  }
  // get ONE user
  async getUser(id) {
    const { data } = await axios.get(HOST + `/api/users/${id}`);

    return data;
  }

  // append movie to the favorited_movies array
  async addMovie(name, movieData) {
    const { data } = await axios.put(HOST + `/api/users/${name}`, movieData);

    return data;
  }

  // delete movie from the favorited_movies array
  async deleteMovie(name, title) {
    const { data } = await axios.delete(
      HOST + `/api/users/${name}/movies/${title.replace(" ", "%20")}`
    );

    return data;
  }
}

const api = new API();

export default api;

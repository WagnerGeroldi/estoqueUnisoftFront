import axios from "axios";
import { getUserLocalStorage } from "../state/SaveLocalStorage";

const baseURL = "http://localhost:3333/";

const api = axios.create({
  baseURL: baseURL,

  headers: {
    "Content-Type": "application/json",
  },
});

api.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.put['Access-Control-Allow-Origin'] = '*';
api.defaults.headers.delete['Access-Control-Allow-Origin'] = '*';
const user = getUserLocalStorage();

if (user) {
  api.defaults.headers.common["x-access-token"] = user.token;
}

export { api };

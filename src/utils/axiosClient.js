import axios from "axios";

export const chatbotClient = axios.create({
  baseURL: "http://98.80.203.162:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "10s", target: 300 },
    { duration: "1m", target: 300 },
    { duration: "10s", target: 10 },
    { duration: "10s", target: 10 },
  ],
};

export default function () {
  http.post(
    "http://localhost:3000/checkout/simple",
    JSON.stringify({ items: 1 })
  );
  sleep(0.1);
}

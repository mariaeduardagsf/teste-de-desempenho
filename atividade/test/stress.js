import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "2m", target: 200 },
    { duration: "2m", target: 500 },
    { duration: "2m", target: 1000 },
    { duration: "30s", target: 1000 },
  ],
};

export default function () {
  http.post(
    "http://localhost:3000/checkout/crypto",
    JSON.stringify({ items: 1 })
  );
  sleep(0.5);
}

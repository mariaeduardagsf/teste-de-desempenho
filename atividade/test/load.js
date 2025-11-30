import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "2m", target: 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95) < 500"],
    http_req_failed: ["rate < 0.01"],
  },
};

export default function () {
  http.post(
    "http://localhost:3000/checkout/simple",
    JSON.stringify({ items: 1 })
  );
  sleep(1);
}

const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
beforeEach(() => seed(testData));
afterAll(() => db.end());

// ## Relevant HTTP Status Codes

// - 200 OK
// - 201 Created
// - 204 No Content
// - 400 Bad Request
// - 404 Not Found
// - 405 Method Not Allowed
// - 418 I'm a teapot
// - 422 Unprocessable Entity
// - 500 Internal Server Error

describe("GET requests", () => {
  test("Status 200: GET /api/topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        let { userTopics } = body;
        console.log(userTopics);
        expect(userTopics).toBeInstanceOf(Array);
      });
  });
});

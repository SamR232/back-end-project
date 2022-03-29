const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
beforeEach(() => seed(testData));
afterAll(() => db.end());

// - 200 OK
// - 201 Created
// - 204 No Content
// - 400 Bad Request
// - 404 Not Found
// - 500 Internal Server Error

describe(`GET /api/topics`, () => {
  test(`Status: 200 - Responds with an array of topic objects
 with the following properties: slug, description`, () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        let { userTopics } = body;
        expect(userTopics).toBeInstanceOf(Array);
        expect(
          userTopics.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          })
        );
      });
  });
  test("Status: 404 - Not found, when endpoint does not exist", () => {
    return request(app)
      .get("/api/anfg")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test(`Status: 200 - Responds with an article object, which should have the following properties:
author, title, article_id, body, topic, created_at, votes `, () => {
    const article_id = 2;
    return request(app)
      .get(`/api/users/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        let { articleInfo } = body;
        expect(articleInfo.title).toEqual("Sony Vaio; or, The Laptop");
        expect(articleInfo.author).toEqual("icellusedkars");
      });
  });
  test(`Status: 400 - Bad Request, when id is not an integer`, () => {
    const article_id = "dog";
    return request(app)
      .get(`/api/users/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid id");
      });
  });
  test(`Status: 404 - Bad Request, id does not exist`, () => {
    const article_id = 1000;
    return request(app)
      .get(`/api/users/${article_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article not found");
      });
  });
});

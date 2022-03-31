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
  test("Status: 404 - endpoint does not exist", () => {
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
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        let { articleInfo } = body;
        expect(articleInfo.title).toEqual("Sony Vaio; or, The Laptop");
        expect(articleInfo.author).toEqual("icellusedkars");
      });
  });
  test(`Status: 400 - id is of wrong data type`, () => {
    const article_id = "dog";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test(`Status: 404 - id does not exist`, () => {
    const article_id = 1000;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Status: 200 - increases vote count", () => {
    let updateVotes = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(150);
      });
  });
  test("Status: 200 - decreases vote count", () => {
    let updateVotes = { inc_votes: -50 };
    return request(app)
      .patch("/api/articles/1")
      .send(updateVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(50);
      });
  });
  //async await
  test("Status: 400 - patch object is empty", async () => {
    let votesObj = {};
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(votesObj)
      .expect(400);
    expect(body.msg).toEqual("No data in object");
  });
  test("Status: 400 - invalid data type for votes", async () => {
    let votesObj = { inc_votes: "dog" };
    const { body } = await request(app)
      .patch("/api/articles/1")
      .send(votesObj)
      .expect(400);
    expect(body.msg).toEqual("Bad Request");
  });
  test("Status: 400 - endpoint does not exist", async () => {
    const { body } = await request(app)
      .patch("/api/articles/anfg")
      .send({ inc_votes: 10 })
      .expect(400);
    expect(body.msg).toEqual("Bad Request");
  });
  test("Status: 404 - article id does not exist", async () => {
    const { body } = await request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 10 })
      .expect(404);
    expect(body.msg).toEqual("article not found");
  });
});

describe("GET api/users", () => {
  test("Status: 200 - responds with an array of objects with a username property", async () => {
    const { body } = await request(app).get("/api/users");
    expect(200);
    console.log(body);
    expect(body).toBeInstanceOf(Array);
    expect(typeof body[0].username).toBe("string");
    expect(body.length).toBe(4);
  });
  test("Status: 404 - endpoint does not exist", async () => {
    const { body } = await request(app).get("/api/asdf").expect(404);
    expect(body.msg).toEqual("Not Found");
  });
});

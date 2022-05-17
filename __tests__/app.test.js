const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

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
    const { body } = await request(app).get("/api/users").expect(200);
    expect(body).toBeInstanceOf(Array);
    expect(typeof body[0].username).toBe("string");
    expect(body.length).toBe(4);
  });
  test("Status: 404 - endpoint does not exist", async () => {
    const { body } = await request(app).get("/api/asdf").expect(404);
    expect(body.msg).toEqual("Not Found");
  });
});

describe("GET api/articles", () => {
  test("responds with an array of article objects, each containing author(username), title, article_id, topic, created_at, votes, comment_count", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body).toBeInstanceOf(Array);
    expect(
      body.forEach((article) => {
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      })
    );
  });
  test("articles are sorted by order of date in descending order", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body).toBeSortedBy("created_at", { descending: true });
  });
});

describe("GET /api/articles/:article_id (comment count)", () => {
  test("Status: 200 - an article response object which also has a comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        let { articleInfo } = body;
        expect(articleInfo["comment_count"]).toBe(11);
        expect(typeof articleInfo["comment_count"]).toBe("number");
      });
  });
  test("Status: 404 - article id does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("article not found");
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("Status: 200 an array of comments for the given article_id of which has the properties: comment_id, votes, created_at, author(username), body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(
          body.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                article_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          })
        );
      });
  });
  test("Status: 404 endpoint does not exist", () => {
    return request(app)
      .get("/api/articles/1/asdg")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test('Status: 404 article doesn"t have any comments', () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "No comments for specified article, check article id exists"
        );
      });
  });

  test('Status: 404 article doesn"t exist', () => {
    return request(app)
      .get("/api/articles/3000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "No comments for specified article, check article id exists"
        );
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("200: sorts the articles by the column, defaulting to date in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=date")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: order search by ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=date&order=asc")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("200: filter the articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(1);
      });
  });
  test("400: invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=month")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Please enter a valid sort_by query");
      });
  });
  test("400: invalid order query", () => {
    return request(app)
      .get("/api/articles?order=yellow")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Please enter a valid order query");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Status: 201 posts a comment object with username and body properties", () => {
    const comment = { username: "icellusedkars", body: "this is a comment" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual({
          article_id: 2,
          author: "icellusedkars",
          body: "this is a comment",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("Status: 400 invalid article id", () => {
    return request(app)
      .post("/api/articles/asdg/comments")
      .send({ username: "icellusedkars", body: "this is a comment" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("Status: 404 user not found", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "captain america", body: "best avenger" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("username does not exist");
      });
  });
});

describe("GET /api", () => {
  test("Status 200: returns a list of endpoints included in api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: delete the comment with matching comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("400: comment_id invalid", () => {
    return request(app)
      .delete("/api/comments/five")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
  test("404: comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual(
          "No comments for specified comment id, check comment id exists"
        );
      });
  });
});

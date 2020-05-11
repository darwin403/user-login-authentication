// Setting up the database connection
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./mydb.sqlite",
  },
});

// create tables
knex.schema
  .createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.string("email");
    table.string("password");
    table.string("token");
    table.text("posts");
  })
  .then(i => i)
  .catch(i => i);

knex.schema
  .createTable("posts", function (table) {
    table.increments("id").primary();
    table.string("title");
    table.text("content");
    table.string("belongs_to");
  })
  .then(i => i)
  .catch(i => i);

const bookshelf = require("bookshelf")(knex);

// create models
const User = bookshelf.model("User", {
  tableName: "users",
});

const Post = bookshelf.model("Post", {
  tableName: "posts",
});

module.exports = {
  User,
  Post,
};

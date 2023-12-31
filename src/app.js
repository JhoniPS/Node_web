const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/", (request, response) => {
  return response.send(`
    <h1>Servidor rodando com ExpressJS</h1>
    <h4>Rotas do Sistema</h4>
      <ul>
        <li>GET:<a href="http://localhost:3333/repositories">/repositories</a></li>
        <li>POST: /repositories</li>
        <li>PUT: /repositories/:id</li>
        <li>DELETE: /repositories/:id</li>
        <li>POST: /repositories/:id/like</li>
      </ul>
  `);
});

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: "Repository not found" });
  }

  const repository = repositories[repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (repositoryIndex === -1) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Repository not found" });
  }

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;

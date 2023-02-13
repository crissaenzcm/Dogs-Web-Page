const { Router } = require("express");
const {
  getAllDogsHandler,
  getDogByIdHandler,
  createDogHandler,
} = require("../handlers/dogsHandlers");
const dogsRouter = Router();

dogsRouter.get("/", getAllDogsHandler);

dogsRouter.get("/:id", getDogByIdHandler);

dogsRouter.post("/create", createDogHandler);

module.exports = dogsRouter;

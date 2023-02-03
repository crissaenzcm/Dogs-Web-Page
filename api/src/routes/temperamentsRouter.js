const { Router } = require("express");
const { getTempsHandler } = require("../handlers/tempHandlers");

const temperamentsRouter = Router();

temperamentsRouter.get("/", getTempsHandler);
module.exports = temperamentsRouter;

import "dotenv/config";
import express from "express";
import http from "http";
import Database from "./database/index.js";
import Logger from "./utils/logger.js";
import LeaderboardManager from "./leaderboard/leaderboardManager.js";
import indexRouter from "./webserver/indexRouter.js";

export const db = new Database();
export const app = express()
export const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.disable('x-powered-by')

app.use('/', indexRouter)

db.onLoad(() => {
    LeaderboardManager.init()
})

server.listen(PORT, () => {
    Logger.info("Server", `Server listening on port ${PORT}`);

    db.init()
});

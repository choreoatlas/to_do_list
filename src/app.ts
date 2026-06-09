import express, { type Express } from "express"
import { createTodosRouter } from "./route/todos"
import type { TodoRepository } from "./persistence/todoRepo"

export function createApp(repo?: TodoRepository): Express {
	const app = express()
	app.use(express.json())
	app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }))
	app.use("/todos", createTodosRouter(repo))
	return app
}

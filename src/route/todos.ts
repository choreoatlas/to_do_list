// EL-route: HTTP handlers.
// S2 wires FL1 (POST /todos); S3 wires FL2 (GET /todos).
import { Router } from "express"
import { validateCreateTodo } from "../validation/todoSchema"
import { makeTodo } from "../model/todo"
import { todoRepo, type TodoRepository } from "../persistence/todoRepo"

export function createTodosRouter(repo: TodoRepository = todoRepo): Router {
	const router = Router()

	// FL1 创建待办: route -> validation -> model -> persistence -> 201
	router.post("/", (req, res) => {
		const result = validateCreateTodo(req.body)
		if (!result.ok || !result.value) {
			return res.status(400).json({ errors: result.errors })
		}
		const todo = makeTodo(result.value)
		repo.create(todo)
		return res.status(201).json(todo)
	})

	// FL2 列出待办: persistence -> 200
	router.get("/", (_req, res) => {
		return res.status(200).json(repo.list())
	})

	return router
}

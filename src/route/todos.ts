// EL-route: HTTP handlers. S2 wires FL1 (POST /todos).
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

	return router
}

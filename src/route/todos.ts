// EL-route: HTTP handlers.
// S2 wires FL1 (POST /todos); S3 wires FL2 (GET /todos); S4 wires FL3-5 (:id read/update/delete).
import { Router } from "express"
import { validateCreateTodo, validateUpdateTodo } from "../validation/todoSchema"
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

	// FL3 读取单条: 命中 200 / 缺失 404
	router.get("/:id", (req, res) => {
		const todo = repo.getById(req.params.id)
		if (!todo) return res.status(404).json({ error: "not_found" })
		return res.status(200).json(todo)
	})

	// FL4 更新（部分合并）: 校验先行(400)，再查存在(404)
	router.patch("/:id", (req, res) => {
		const result = validateUpdateTodo(req.body)
		if (!result.ok || !result.value) {
			return res.status(400).json({ errors: result.errors })
		}
		const updated = repo.update(req.params.id, result.value)
		if (!updated) return res.status(404).json({ error: "not_found" })
		return res.status(200).json(updated)
	})

	// FL5 删除: 204 / 缺失 404
	router.delete("/:id", (req, res) => {
		const ok = repo.delete(req.params.id)
		if (!ok) return res.status(404).json({ error: "not_found" })
		return res.status(204).send()
	})

	return router
}

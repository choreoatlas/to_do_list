import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"
import { InMemoryTodoRepository } from "../src/persistence/todoRepo"

// FN5-SPEC-R1: DELETE /todos/:id → 204 | 404
describe("FL5 删除 (DELETE /todos/:id)", () => {
	it("删存在 → 204，再 GET → 404", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const created = await request(app).post("/todos").send({ title: "x" })
		const id = created.body.id
		const del = await request(app).delete(`/todos/${id}`)
		expect(del.status).toBe(204)
		const get = await request(app).get(`/todos/${id}`)
		expect(get.status).toBe(404)
	})

	it("删不存在 → 404（幂等）", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app).delete("/todos/nope")
		expect(res.status).toBe(404)
	})
})

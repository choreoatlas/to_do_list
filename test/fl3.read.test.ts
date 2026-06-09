import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"
import { InMemoryTodoRepository } from "../src/persistence/todoRepo"

// FN3-SPEC-R1: GET /todos/:id → 200 Todo | 404 not_found
describe("FL3 读取单条 (GET /todos/:id)", () => {
	it("存在 id → 200 + body 匹配", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const created = await request(app).post("/todos").send({ title: "x" })
		const id = created.body.id
		const res = await request(app).get(`/todos/${id}`)
		expect(res.status).toBe(200)
		expect(res.body.id).toBe(id)
		expect(res.body.title).toBe("x")
	})

	it("缺失 id → 404 not_found", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app).get("/todos/nope")
		expect(res.status).toBe(404)
		expect(res.body.error).toBe("not_found")
	})
})

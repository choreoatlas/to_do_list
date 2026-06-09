import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"
import { InMemoryTodoRepository } from "../src/persistence/todoRepo"

describe("FL1 创建待办 (POST /todos)", () => {
	it("creates a todo and returns 201 with the entity", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app).post("/todos").send({ title: "buy milk" })
		expect(res.status).toBe(201)
		expect(res.body.id).toBeTruthy()
		expect(res.body.title).toBe("buy milk")
		expect(res.body.completed).toBe(false)
		expect(typeof res.body.createdAt).toBe("string")
	})

	it("rejects empty / whitespace title with 400", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app).post("/todos").send({ title: "   " })
		expect(res.status).toBe(400)
		expect(Array.isArray(res.body.errors)).toBe(true)
	})

	it("rejects non-boolean completed with 400", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app)
			.post("/todos")
			.send({ title: "x", completed: "yes" })
		expect(res.status).toBe(400)
	})

	it("trims the title", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app).post("/todos").send({ title: "  hello  " })
		expect(res.status).toBe(201)
		expect(res.body.title).toBe("hello")
	})
})

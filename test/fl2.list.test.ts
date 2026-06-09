import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"
import { InMemoryTodoRepository } from "../src/persistence/todoRepo"

describe("FL2 列出待办 (GET /todos)", () => {
	it("returns an empty array initially", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app).get("/todos")
		expect(res.status).toBe(200)
		expect(Array.isArray(res.body)).toBe(true)
		expect(res.body.length).toBe(0)
	})

	it("returns created todos", async () => {
		const app = createApp(new InMemoryTodoRepository())
		await request(app).post("/todos").send({ title: "a" })
		await request(app).post("/todos").send({ title: "b" })
		const res = await request(app).get("/todos")
		expect(res.status).toBe(200)
		expect(res.body.length).toBe(2)
		const titles = res.body.map((t: { title: string }) => t.title)
		expect(titles).toContain("a")
		expect(titles).toContain("b")
	})
})

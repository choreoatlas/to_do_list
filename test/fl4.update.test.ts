import { describe, it, expect } from "vitest"
import request from "supertest"
import { createApp } from "../src/app"
import { InMemoryTodoRepository } from "../src/persistence/todoRepo"

// FN4-SPEC-R1: PATCH /todos/:id 部分合并 → 200 | 404 | 400
describe("FL4 更新 (PATCH /todos/:id)", () => {
	async function seed(app: ReturnType<typeof createApp>) {
		const r = await request(app).post("/todos").send({ title: "orig" })
		return r.body
	}

	it("改 title → 200 且 completed 不变 且 id/createdAt 不变", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const t = await seed(app)
		const res = await request(app).patch(`/todos/${t.id}`).send({ title: "new" })
		expect(res.status).toBe(200)
		expect(res.body.title).toBe("new")
		expect(res.body.completed).toBe(t.completed)
		expect(res.body.id).toBe(t.id)
		expect(res.body.createdAt).toBe(t.createdAt)
	})

	it("改 completed → 200 且 title 保留", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const t = await seed(app)
		const res = await request(app).patch(`/todos/${t.id}`).send({ completed: true })
		expect(res.status).toBe(200)
		expect(res.body.completed).toBe(true)
		expect(res.body.title).toBe("orig")
	})

	it("缺失 id → 404", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const res = await request(app).patch("/todos/nope").send({ title: "x" })
		expect(res.status).toBe(404)
	})

	it("空 {} → 400", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const t = await seed(app)
		const res = await request(app).patch(`/todos/${t.id}`).send({})
		expect(res.status).toBe(400)
	})

	it("completed 非布尔 → 400", async () => {
		const app = createApp(new InMemoryTodoRepository())
		const t = await seed(app)
		const res = await request(app).patch(`/todos/${t.id}`).send({ completed: "yes" })
		expect(res.status).toBe(400)
	})
})

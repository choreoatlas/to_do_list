// EL-persistence: SQLite-backed repository (file or :memory:).
// Same TodoRepository contract as InMemory; better-sqlite3 is synchronous,
// so FL1–FL5 stay sync and their contracts are unchanged (mechanism swap only).
import Database from "better-sqlite3"
import type { Todo } from "../model/todo"
import type { TodoRepository, UpdateTodoPatch } from "./todoRepo"

interface Row {
	id: string
	title: string
	completed: number // SQLite has no boolean; store 0/1
	createdAt: string
}

export class SqliteTodoRepository implements TodoRepository {
	private readonly db: Database.Database

	constructor(filename: string = ":memory:") {
		this.db = new Database(filename)
		this.db.pragma("journal_mode = WAL")
		this.db.exec(
			`CREATE TABLE IF NOT EXISTS todos (
				id TEXT PRIMARY KEY,
				title TEXT NOT NULL,
				completed INTEGER NOT NULL DEFAULT 0,
				createdAt TEXT NOT NULL
			)`,
		)
	}

	private toTodo(row: Row): Todo {
		return {
			id: row.id,
			title: row.title,
			completed: row.completed === 1,
			createdAt: row.createdAt,
		}
	}

	create(todo: Todo): Todo {
		this.db
			.prepare(
				`INSERT INTO todos (id, title, completed, createdAt) VALUES (?, ?, ?, ?)`,
			)
			.run(todo.id, todo.title, todo.completed ? 1 : 0, todo.createdAt)
		return todo
	}

	list(): Todo[] {
		const rows = this.db
			.prepare(`SELECT id, title, completed, createdAt FROM todos`)
			.all() as Row[]
		return rows.map((r) => this.toTodo(r))
	}

	getById(id: string): Todo | undefined {
		const row = this.db
			.prepare(
				`SELECT id, title, completed, createdAt FROM todos WHERE id = ?`,
			)
			.get(id) as Row | undefined
		return row ? this.toTodo(row) : undefined
	}

	update(id: string, patch: UpdateTodoPatch): Todo | undefined {
		const existing = this.getById(id)
		if (!existing) return undefined
		// 部分合并：仅更新出现的字段；id / createdAt 不变
		const updated: Todo = {
			...existing,
			...(patch.title !== undefined ? { title: patch.title } : {}),
			...(patch.completed !== undefined ? { completed: patch.completed } : {}),
		}
		this.db
			.prepare(`UPDATE todos SET title = ?, completed = ? WHERE id = ?`)
			.run(updated.title, updated.completed ? 1 : 0, id)
		return updated
	}

	delete(id: string): boolean {
		const info = this.db.prepare(`DELETE FROM todos WHERE id = ?`).run(id)
		return info.changes > 0
	}

	count(): number {
		const row = this.db.prepare(`SELECT COUNT(*) AS c FROM todos`).get() as {
			c: number
		}
		return row.c
	}
}

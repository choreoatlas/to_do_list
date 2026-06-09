// EL-persistence: storage / data access (in-memory for now; FL1–FL5)
import type { Todo } from "../model/todo"

export interface TodoRepository {
	create(todo: Todo): Todo
	// future paths: list(), getById(), update(), delete()
}

export class InMemoryTodoRepository implements TodoRepository {
	private readonly store = new Map<string, Todo>()

	create(todo: Todo): Todo {
		this.store.set(todo.id, todo)
		return todo
	}

	count(): number {
		return this.store.size
	}
}

export const todoRepo = new InMemoryTodoRepository()

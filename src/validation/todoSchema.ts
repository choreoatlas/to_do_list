// EL-validation: input validation (FL1 create; reused by FL4 update)
import type { CreateTodoInput } from "../model/todo"

export interface ValidationResult<T> {
	ok: boolean
	value?: T
	errors: string[]
}

export function validateCreateTodo(
	body: unknown,
): ValidationResult<CreateTodoInput> {
	if (typeof body !== "object" || body === null) {
		return { ok: false, errors: ["body must be a JSON object"] }
	}
	const b = body as Record<string, unknown>
	const errors: string[] = []

	const title = b.title
	if (typeof title !== "string" || title.trim().length === 0) {
		errors.push("title is required and must be a non-empty string")
	} else if (title.length > 500) {
		errors.push("title must be at most 500 characters")
	}

	let completed: boolean | undefined
	if (b.completed !== undefined) {
		if (typeof b.completed !== "boolean") {
			errors.push("completed must be a boolean when provided")
		} else {
			completed = b.completed
		}
	}

	if (errors.length > 0) return { ok: false, errors }
	return {
		ok: true,
		value: { title: (title as string).trim(), completed },
		errors: [],
	}
}

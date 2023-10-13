import { sql } from '../database/database.js'

const listAnswerOptions = async (qId) => {
	const ans =
		await sql`SELECT * FROM question_answer_options WHERE question_id = ${qId}`

	return ans
}

const addAnswerOption = async (text, correct, questionId) => {
	await sql`INSERT INTO question_answer_options (option_text, is_correct, question_id) VALUES (${text},${correct},${questionId})`
}

const deleteAnswer = async (opId) => {
	await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${opId}`
	await sql`DELETE FROM question_answers_options WHERE id = ${opId}`
}

const getQuestion = async (id) => {
	return await sql`SELECT * FROM questions WHERE id = ${id}`
}

const deleteAnswerOption = async (id) => {
	await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${id}`
	await sql`DELETE FROM question_answer_options WHERE id = ${id}`
}

const getQuestions = async () => {
	return await sql`SELECT * FROM questions`
}

const listAnswerOptionsForAPI = async (qId) => {
	const ans = await sql`SELECT id AS optionId, option_text AS optionTEXT
		FROM question_answer_options
		WHERE question_id = ${qId};`

	return ans
}

export {
	listAnswerOptions,
	addAnswerOption,
	deleteAnswer,
	getQuestion,
	deleteAnswerOption,
	getQuestions,
	listAnswerOptionsForAPI,
}

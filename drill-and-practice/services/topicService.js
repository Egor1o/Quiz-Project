import { sql } from '../database/database.js'

const getTopics = async () => {
	return await sql`SELECT * FROM topics ORDER BY name ASC `
}

const addTopic = async (name, user_id) => {
	await sql`INSERT INTO topics (name, user_id) VALUES(${name}, ${user_id})`
}

const deleteTopic = async (id) => {
	const questionIDs =
		await sql`SELECT id FROM questions WHERE topic_id = ${id}`

	for (const questionID of questionIDs) {
		await deleteQuestionAnswers(questionID.id)
		await deleteQuestionAnswerOptions(questionID.id)
		await deleteQuestion(questionID.id)
	}

	await removeTopic(id)
}

const deleteQuestionAnswers = async (questionID) => {
	await sql`DELETE FROM question_answers WHERE question_id = ${questionID}`
}

const deleteQuestionAnswerOptions = async (questionID) => {
	await sql`DELETE FROM question_answer_options WHERE question_id = ${questionID}`
}

const deleteQuestion = async (questionID) => {
	await sql`DELETE FROM questions WHERE id = ${questionID}`
}

const removeTopic = async (id) => {
	await sql`DELETE FROM topics WHERE id = ${id}`
}

export { getTopics, addTopic, deleteTopic, deleteQuestion }

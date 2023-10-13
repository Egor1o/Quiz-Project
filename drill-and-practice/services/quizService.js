import { sql } from '../database/database.js'

const alphabeticTopics = async () => {
	return await sql`SELECT * FROM topics ORDER BY name`
}

const getTopicsQuestions = async (id) => {
	return await sql`SELECT * FROM questions WHERE topic_id = ${id}`
}

const getOption = async (id, qId) => {
	if (!qId) {
		return await sql`SELECT * FROM question_answer_options WHERE id = ${id}`
	} else {
		return sql`SELECT * FROM question_answer_options WHERE id = ${id} AND question_id = ${qId}`
	}
}

const saveAnswer = async (userId, questionId, optionId) => {
	await sql`INSERT INTO question_answers (question_answer_option_id,question_id, user_id) VALUES (${optionId},${questionId},${userId})`
}

export { alphabeticTopics, getTopicsQuestions, getOption, saveAnswer }

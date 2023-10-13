import { sql } from '../database/database.js'

const getTopicQuestions = async (id) => {
	return await sql`SELECT * FROM questions WHERE topic_id = ${id}`
}

const getTopic = async (id) => {
	return await sql`SELECT * FROM topics WHERE id = ${id} `
}

const addQuestion = async (topic_id, question, user_id) => {
	await sql`INSERT INTO questions (question_text, user_id , topic_id) VALUES (${question},${user_id},${topic_id})`
}

export { getTopicQuestions, getTopic, addQuestion }

import { sql } from '../database/database.js'

const giveStatistics = async () => {
	const topicsResult = await sql`SELECT COUNT(*) AS count FROM topics`
	const questionsResult = await sql`SELECT COUNT(*) AS count FROM questions`
	const userAnswersResult = await sql`
    SELECT COUNT(*) AS count FROM question_answers
    WHERE user_id NOT IN (
      SELECT id FROM users WHERE admin = TRUE
    )`
	return [
		topicsResult[0].count,
		questionsResult[0].count,
		userAnswersResult[0].count,
	]
}

export { giveStatistics }

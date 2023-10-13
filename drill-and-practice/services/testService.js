import { sql } from '../database/database.js'

// for needs of the testing if `docker-compose down` is not used

const testStarter = async () => {
	await sql`DELETE FROM question_answer_options`
	await sql`DELETE FROM question_answers`
	await sql`DELETE FROM questions`
	await sql`DELETE FROM topics`
	await sql`DELETE FROM users WHERE email = 'dungeonMaster@gmail.com'`
	await sql`INSERT INTO topics (name, user_id) VALUES ('Finnish language', 1)`
}

export { testStarter }

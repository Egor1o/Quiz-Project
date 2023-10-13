import {
	minLength,
	required,
	validate,
} from 'https://deno.land/x/validasaur@v0.15.0/mod.ts'
import * as singleTopicService from '../../services/singleTopicService.js'
const showTopic = async ({ params, render, user, response }) => {
	const tId = params.id
	if (user) {
		const topic = await singleTopicService.getTopic(tId)

		const questions = await singleTopicService.getTopicQuestions(tId)

		render('partials/topic.eta', {
			questions: questions,
			topic: topic[0].name,
			id: topic[0].id,
			user: user,
			errors: [],
			question_text: '',
		})
	} else {
		response.redirect('/auth/login')
	}
}

const addQuestion = async ({ render, request, params, user, response }) => {
	const id = params.id
	const data = await request.body({ type: 'form' }).value
	const rules = {
		question_text: [required, minLength(1)],
	}
	const [passes, errors] = await validate(
		{ question_text: data.get('question_text') },
		rules
	)
	if (user && passes) {
		singleTopicService.addQuestion(id, data.get('question_text'), user.id)
		response.redirect('/topics/' + id)
	} else if (user) {
		const tId = params.id
		const topic = await singleTopicService.getTopic(tId)
		const questions = await singleTopicService.getTopicQuestions(tId)
		render('partials/topic.eta', {
			questions: questions,
			topic: topic[0].name,
			id: topic[0].id,
			user: user,
			errors: Object.values(errors.question_text),
			question_text: data.get('question_text'),
		})
	} else {
		response.redirect('/auth/login')
	}
}

export { showTopic, addQuestion }

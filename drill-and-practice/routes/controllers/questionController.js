import {
	minLength,
	required,
	validate,
} from 'https://deno.land/x/validasaur@v0.15.0/mod.ts'
import * as questionService from '../../services/questionService.js'
import * as singleTopicService from '../../services/singleTopicService.js'
import * as topicService from '../../services/topicService.js'

const listAnswerOptions = async ({ render, user, params }) => {
	const tId = params.id
	const qId = params.qId
	const options = await questionService.listAnswerOptions(qId)
	const question = await questionService.getQuestion(qId)
	const topic = await singleTopicService.getTopic(tId)
	if (user) {
		render('partials/question.eta', {
			options: options,
			question: question[0].question_text,
			topic: topic[0].name,
			errors: [],
			user: user,
			id: tId,
			question_id: qId,
			option_text: '',
		})
	}
}

const addAnswerOption = async ({ render, params, request, user, response }) => {
	const qId = params.qId
	const tId = params.id
	const options = await questionService.listAnswerOptions(qId)
	const question = await questionService.getQuestion(qId)
	const topic = await singleTopicService.getTopic(tId)
	const data = await request.body({ type: 'form' }).value

	const rules = {
		option_text: [required, minLength(1)],
	}
	const [passes, errors] = await validate(
		{
			option_text: data.get('option_text'),
		},
		rules
	)
	if (user && passes) {
		let correct = data.get('is_correct')
		if (correct == null) {
			correct = false
		} else {
			correct = true
		}
		await questionService.addAnswerOption(
			data.get('option_text'),
			correct,
			qId
		)
		response.redirect('/topics/' + params.id + '/questions/' + qId)
	} else if (!user) {
		response.redirect('/auth/login')
	} else {
		render('partials/question.eta', {
			options: options,
			question: question[0].question_text,
			topic: topic[0].name,
			errors: Object.values(errors),
			user: user,
			id: tId,
			question_id: qId,
			option_text: data.get('option_text'),
		})
	}
}

const removeOption = async ({ params, user, response }) => {
	if (user) {
		await questionService.deleteAnswerOption(params.oId)
		response.redirect('/topics/' + params.tId + '/questions/' + params.qId)
	} else response.redirect('/auth/login')
}

const removeQuestion = async ({ params, user, response }) => {
	if (user) {
		const qId = params.qId
		await topicService.deleteQuestion(qId)
		response.redirect('/topics/' + params.tId)
	} else {
		response.redirect('/auth/login')
	}
}

const getSingleOption = async (qId, oId) => {}

export {
	listAnswerOptions,
	addAnswerOption,
	removeOption,
	removeQuestion,
	getSingleOption,
}

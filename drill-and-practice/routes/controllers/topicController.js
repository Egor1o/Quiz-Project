import {
	minLength,
	required,
	validate,
} from 'https://deno.land/x/validasaur@v0.15.0/mod.ts'
import * as topicService from '../../services/topicService.js'

const showTopics = async ({ render, user, response }) => {
	if (user) {
		render('partials/topics.eta', {
			topics: await topicService.getTopics(),
			user: user,
			value: '',
			errors: [],
			question_text: '',
		})
	} else {
		response.redirect('/auth/login')
	}
}

const addTopic = async ({ request, user, response, render }) => {
	const body = request.body({ type: 'form' })
	const formParams = await body.value
	const data = { name: formParams.get('name') }
	const rules = {
		name: [required, minLength(1)],
	}
	const [passes, errors] = await validate(data, rules)
	if (passes && user) {
		await topicService.addTopic(data.name, user.id)
		response.redirect('/topics')
	} else if (user) {
		render('partials/topics.eta', {
			topics: await topicService.getTopics(),
			user: user,
			value: data.name,
			errors: Object.values(errors.name),
		})
	}
}

const deleteTopic = async ({ request, user, response, params }) => {
	const topicId = params.id
	if (user && user.admin) {
		await topicService.deleteTopic(topicId)
		response.redirect('/topics')
	} else {
		response.redirect('/topics')
	}
}

export { showTopics, addTopic, deleteTopic }

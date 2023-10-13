import * as questionService from '../../services/questionService.js'
import * as quizService from '../../services/quizService.js'

const showQuizMain = async ({ render, user, response }) => {
	const topics = await quizService.alphabeticTopics()
	if (user) {
		render('partials/quiz.eta', { topics: topics })
	} else {
		response.redirect('/auth/login')
	}
}

const getRandomQuestion = async ({ render, user, response, params }) => {
	const mappedQuestionIds = (
		await quizService.getTopicsQuestions(params.tId)
	).map((question) => {
		return question.id
	})

	if (user) {
		const randomIndex = Math.floor(Math.random() * mappedQuestionIds.length)
		if (mappedQuestionIds.length === 0) {
			render('partials/quizNoQuestion.eta')
		} else {
			const question = await quizService.getTopicsQuestions(params.tId)
			response.redirect(
				'/quiz/' + params.tId + '/questions/' + question[randomIndex].id
			)
		}
	} else {
		response.redirect('/auth/login')
	}
}

const showRandomQuestionOptions = async ({
	user,
	response,
	params,
	render,
}) => {
	if (user) {
		const questionId = params.qId
		const options = await questionService.listAnswerOptions(questionId)
		const question = await questionService.getQuestion(questionId)
		render('partials/quizHasQuestion.eta', {
			options: options,
			question: question[0],
		})
	} else {
		response.redirect('/auth/login')
	}
}

const redirectToStatus = async ({ response, user, params }) => {
	const optionId = params.oId
	const questionId = params.qId
	const topicId = params.tId
	const option = await quizService.getOption(optionId)
	if (user) {
		await quizService.saveAnswer(user.id, questionId, optionId)
		if (option[0].is_correct) {
			response.redirect(
				'/quiz/' + topicId + '/questions/' + questionId + '/correct'
			)
		} else {
			response.redirect(
				'/quiz/' + topicId + '/questions/' + questionId + '/incorrect'
			)
		}
	} else {
		response.redirect('/auth/login')
	}
}

const showCorrectStatus = async ({ user, params, render, response }) => {
	if (user) {
		render('partials/correctAnswer.eta', {
			tId: params.tId,
			qId: params.qId,
		})
	} else {
		response.redirect('/auth/login')
	}
}
const showIncorrectStatus = async ({ user, params, render, response }) => {
	const right_options = (
		await questionService.listAnswerOptions(params.qId)
	).filter((option) => {
		return option.is_correct
	})
	if (user) {
		if (right_options.length > 0) {
			render('partials/incorrectAnswer.eta', {
				tId: params.tId,
				qId: params.qId,
				option: right_options,
			})
		} else {
			render('partials/incorrectAnswer.eta', {
				tId: params.tId,
				qId: params.qId,
				option: [],
			})
		}
	} else {
		response.redirect('/auth/login')
	}
}

export {
	showQuizMain,
	getRandomQuestion,
	showRandomQuestionOptions,
	redirectToStatus,
	showCorrectStatus,
	showIncorrectStatus,
}

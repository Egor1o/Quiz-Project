import * as questionService from '../../services/questionService.js'
import * as quizService from '../../services/quizService.js'

/*{
  "questionId": 1,
  "questionText": "How much is 1+1?",
  "answerOptions": [
    { "optionId": 1, "optionText": "2" },
    { "optionId": 2, "optionText": "4" },
    { "optionId": 3, "optionText": "6" },
  ]
} 
{
  "questionId": 1,
  "optionId": 3,
}
*/

const sendRandomQuestion = async ({ response }) => {
	const questions = await questionService.getQuestions()
	if (questions && questions.length > 0) {
		const randomIndex = Math.floor(Math.random() * questions.length)
		const question = questions[randomIndex]
		const options = await questionService.listAnswerOptionsForAPI(
			question.id
		)
		let newOption = []
		options.forEach((option) => {
			newOption.push({
				optionId: option.optionid,
				optionText: option.optiontext,
			})
		})

		const data = {
			questionId: question.id,
			questionText: question.question_text,
			answerOptions: newOption,
		}
		response.body = data
	} else {
		response.body = {}
	}
}

const sendAnswer = async ({ request, response }) => {
	const body = request.body({ type: 'json' })
	const gotData = await body.value
	const questionId = gotData.questionId
	const optionId = gotData.optionId
	const valid = await quizService.getOption(optionId, questionId)
	if (valid && valid.length > 0 && valid[0].is_correct) {
		response.body = { correct: true }
	} else if (valid && valid.length > 0) {
		response.body = { correct: false }
	} else {
		response.body = 'There were no such an option or question.'
	}
}

export { sendRandomQuestion, sendAnswer }

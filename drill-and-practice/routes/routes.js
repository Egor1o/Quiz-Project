import { Router } from '../deps.js'
import * as apiController from './apis/apiController.js'
import * as mainController from './controllers/mainController.js'
import * as questionController from './controllers/questionController.js'
import * as quizController from './controllers/quizController.js'
import * as registrationController from './controllers/registrationController.js'
import * as sessionController from './controllers/sessionController.js'
import * as singleTopicController from './controllers/singleTopicController.js'
import * as testController from './controllers/testController.js'
import * as topicController from './controllers/topicController.js'
const router = new Router()

router.get('/', mainController.showMain)
router.get('/topics', topicController.showTopics)
router.get('/auth/register', registrationController.showRegistrationForm)
router.post('/auth/register', registrationController.addNewUser)
router.get('/auth/login', sessionController.showSessionForm)
router.post('/auth/login', sessionController.setSession)
router.post('/topics', topicController.addTopic)
router.post('/topics/:id/delete', topicController.deleteTopic)
router.get('/topics/:id', singleTopicController.showTopic)
router.post('/topics/:id/questions', singleTopicController.addQuestion)
router.get('/topics/:id/questions/:qId', questionController.listAnswerOptions)
router.post(
	'/topics/:id/questions/:qId/options',
	questionController.addAnswerOption
)
router.post(
	'/topics/:tId/questions/:qId/options/:oId/delete',
	questionController.removeOption
)

router.post(
	'/topics/:tId/questions/:qId/delete',
	questionController.removeQuestion
)
router.get('/quiz/:tId', quizController.getRandomQuestion)
router.get('/quiz', quizController.showQuizMain)
router.get(
	'/quiz/:tId/questions/:qId',
	quizController.showRandomQuestionOptions
)
router.post(
	'/quiz/:tId/questions/:qId/options/:oId',
	quizController.redirectToStatus
)

router.get(
	'/quiz/:tId/questions/:qId/correct',
	quizController.showCorrectStatus
)
router.get(
	'/quiz/:tId/questions/:qId/incorrect',
	quizController.showIncorrectStatus
)
router.get('/api/questions/random', apiController.sendRandomQuestion)
router.post('/api/questions/answer', apiController.sendAnswer)
router.get('/logout', sessionController.logOut)
router.get('/starter', testController.testStarter)
export { router }

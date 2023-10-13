import * as testService from '../../services/testService.js'

const delUser = async () => {
	await testService.deleteUser('dungeonMaster@gmail.com')
}

const testStarter = async ({ response }) => {
	await testService.testStarter()
	response.redirect('/topics')
}

export { delUser, testStarter }

import * as mainPageService from '../../services/mainPageService.js'

const showMain = async ({ render }) => {
	render('main.eta', { statistics: await mainPageService.giveStatistics() })
}

export { showMain }
//

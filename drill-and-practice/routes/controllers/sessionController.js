import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'
import * as authorizationService from '../../services/authorizationService.js'

const showSessionForm = async (context) => {
	context.render('partials' + '/authentication/loginForm.eta', {
		name: '',
		email: '',
		errors: [],
	})
}

const setSession = async ({ request, state, response, render }) => {
	const data = await request.body({ type: 'form' }).value
	const email = data.get('email')
	const password = data.get('password')
	const userFromDB = await authorizationService.getUser(email)

	if (userFromDB.length != 1) {
		render('partials' + '/authentication/loginForm.eta', {
			email: email,
			errors: ['Incorrect login or password'],
		})
		return
	}

	const passwordMatches = await bcrypt.compare(
		password,
		userFromDB[0].password
	)

	if (!passwordMatches) {
		render('partials' + '/authentication/loginForm.eta', {
			email: email,
			errors: ['Incorrect login or password'],
		})
		return
	}

	await state.session.set('user', userFromDB[0])
	response.redirect('/topics')
}

const logOut = async (context) => {
	if (context.user) {
		await context.state.session.set('user', null)
		delete context.user
	}
	context.response.redirect('/auth/login')
}

export { showSessionForm, setSession, logOut }

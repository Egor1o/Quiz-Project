import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'
import {
	isEmail,
	minLength,
	notIn,
	required,
	validate,
} from 'https://deno.land/x/validasaur@v0.15.0/mod.ts'
import * as authorizationService from '../../services/authorizationService.js'

const showRegistrationForm = ({ render, user }) => {
	render('partials' + '/authentication/registrationForm.eta', {
		email: '',
		errors: {},
	})
}

const addNewUser = async ({ response, request, render }) => {
	const body = request.body({ type: 'form' })
	const formParams = await body.value
	const email = formParams.get('email')
	const validatedParams = await validation({
		email: email,
		password: formParams.get('password'),
	})
	if (validatedParams.passes) {
		const encryptedPassword = await bcrypt.hash(formParams.get('password'))
		authorizationService.addUser(email, encryptedPassword)
		response.redirect('/auth/login')
	} else {
		render(
			'partials' + '/authentication/registrationForm.eta',
			validatedParams
		)
	}
}

const validation = async (data) => {
	const user = (await authorizationService.getUser(data.email)).map((x) => {
		return x.email
	})

	const validationRules = {
		email: [required, isEmail, notIn(user)],
		password: [required, minLength(4)],
	}
	const [passes, errors] = await validate(data, validationRules)
	if (errors.email && errors.email.notIn) {
		errors.email.notIn =
			'An email with the provided address is already in use.'
	}
	return {
		passes: passes,
		errors: errors,
		email: data.email,
	}
}

export { showRegistrationForm, addNewUser }

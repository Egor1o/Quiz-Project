const { test, expect } = require('@playwright/test')

const register = async (page, email, password) => {
	await page.goto('/auth/register')
	await page.locator("input[id='exampleInputEmail1']").type(email)
	await page.locator("input[id='exampleInputPassword1']").type(password)
	await page.locator('[test-id="subbari"]').click()
}

const login = async (page, email, password) => {
	await page.locator("input[id='exampleInputEmail1']").type(email)
	await page.locator("input[id='exampleInputPassword1']").type(password)
	await page.locator('[test-id="subbariLogin"]').click()
}

const createDataForQuiz = async (page) => {
	await page.goto('/auth/login')
	await login(page, 'admin@admin.com', '123456')
	await page.locator("textarea[test-id='questionInput']").type('GigaTopic')
	await page.locator('button[test-id="topicSubbari"]').click()
	await page
		.locator('ul[test-id="topicList"] li a')
		.filter({ hasText: 'GigaTopic' })
		.first()
		.click()
	await page.locator("textarea[id='questionInput']").type('Question123')
	await page.locator('button[test-id="testSubbari"]').click()
	await page
		.locator('ul[id="questionlist"] li a')
		.filter({ hasText: 'Question123' })
		.first()
		.click()
	await page.locator("textarea[id='answerInput']").type('Answer1')
	await page.locator("input[id='is_correct-input']").click()
	await page.locator('button[id="answerAdderSubbari"]').click()
	await page.locator("textarea[id='answerInput']").type('Answer2')
	await page.locator('button[id="answerAdderSubbari"]').click()
	//Deleting other topics to make sure that json will be correct.
	await page.goto('/topics')
	const listItems = await page.locator('ul[test-id="topicList"] li')
	await listItems.nth(0).getByText('Delete topic').click()
}

test('Unauthorized user is redirected to /auth/login when accessing topics page', async ({
	page,
}) => {
	await page.goto('/starter')
	await page.goto('/topics')
	await expect(await page.url()).toBe('http://localhost:7777/auth/login')
})

test('Unauthorized user is redirected to /auth/login when accessing quiz page', async ({
	page,
}) => {
	await page.goto('/quiz')
	await expect(page.url()).toBe('http://localhost:7777/auth/login')
})

test("Registration and authentication are successfully completed (page's URL is /topics)", async ({
	page,
}) => {
	const email = 'dungeonMaster@gmail.com'
	const password = 'dm123'
	await register(page, email, password)
	await page.waitForLoadState()
	await expect(page.url()).toBe('http://localhost:7777/auth/login')
	await login(page, email, password)
	await page.waitForLoadState()
	await expect(page.url()).toBe('http://localhost:7777/topics')
})

test('When accessing the page with topics as an admin, the topic add form is displayed', async ({
	page,
}) => {
	await page.goto('/auth/login')
	await login(page, 'admin@admin.com', '123456')
	await expect(page.url()).toBe('http://localhost:7777/topics')
	await expect(page.getByPlaceholder('Enter a new topic')).toHaveCount(1)
})

test('Admin can add some topic and delete it', async ({ page }) => {
	await page.goto('/auth/login')
	await login(page, 'admin@admin.com', '123456')

	await page.locator("textarea[test-id='questionInput']").type('GigaTopic')
	await page.locator('button[test-id="topicSubbari"]').click()
	await expect(
		page
			.locator('ul[test-id="topicList"] li a')
			.filter({ hasText: 'GigaTopic' })
	).toHaveCount(1)
})

test('Authorized user can add a question to the topic', async ({ page }) => {
	await page.goto('/auth/login')
	await login(page, 'dungeonMaster@gmail.com', 'dm123')
	await page
		.locator('ul[test-id="topicList"] li a')
		.filter({ hasText: 'GigaTopic' })
		.first()
		.click()
	await expect(page.url()).toMatch(/http:\/\/localhost:7777\/topics\/[0-9]+/)

	await page.locator("textarea[id='questionInput']").type('Question123')
	await page.locator('button[test-id="testSubbari"]').click()
	await expect(
		page
			.locator('ul[id="questionlist"] li a')
			.filter({ hasText: 'Question123' })
	).toHaveCount(1)
})

test('Authorized user can add an option to the to the question and delete it after which he can delete a question', async ({
	page,
}) => {
	await page.goto('/auth/login')
	await login(page, 'dungeonMaster@gmail.com', 'dm123')
	await page
		.locator('ul[test-id="topicList"] li a')
		.filter({ hasText: 'GigaTopic' })
		.first()
		.click()
	await page
		.locator('ul[id="questionlist"] li a')
		.filter({ hasText: 'Question123' })
		.first()
		.click()
	await page.locator("textarea[id='answerInput']").type('Answer1')
	await page.locator("input[id='is_correct-input']").click()
	await page.locator('button[id="answerAdderSubbari"]').click()
	const options = await page
		.locator('ul[id="options"] ul li p')
		.first()
		.textContent()
	await expect(options).toContain('Answer1')
	await page.getByRole('button').filter({ hasText: 'Delete option' }).click()
	await page
		.getByRole('button')
		.filter({ hasText: 'Delete question' })
		.click()
	await expect(page.url()).toMatch(/http:\/\/localhost:7777\/topics\/[0-9]+/)
	await expect(
		page
			.locator('ul[id="questionlist"] li a')
			.filter({ hasText: 'Question123' })
	).toHaveCount(0)
})

test('Admin can delete a topic', async ({ page }) => {
	await page.goto('/auth/login')
	await login(page, 'admin@admin.com', '123456')
	const listItems = await page.locator('ul[test-id="topicList"] li')

	await listItems.nth(1).getByText('Delete topic').click()
	await expect(
		page
			.locator('ul[test-id="topicList"] li a')
			.filter({ hasText: 'GigaTopic' })
	).toHaveCount(0)
})

test('Quiz API will return a topic with question', async ({ page }) => {
	await createDataForQuiz(page)
	const responseBody = await page.evaluate(() => {
		return fetch('http://localhost:7777/api/questions/random').then(
			(response) => response.json()
		)
	})

	const shouldBe = {
		questionText: 'Question123',
		answerOptions: expect.arrayContaining([
			expect.objectContaining({ optionText: 'Answer1' }),
			expect.objectContaining({ optionText: 'Answer2' }),
		]),
	}

	await expect(responseBody).toMatchObject(shouldBe)
})

test('Quiz page should display topics, allow accessing topics, choosing an answer, and redirecting to the answer status page', async ({
	page,
}) => {
	await page.goto('/auth/login')
	await login(page, 'dungeonMaster@gmail.com', 'dm123')
	await page.goto('/quiz')
	await page
		.locator('ul[id="quizList"] li')
		.filter({ hasText: 'GigaTopic' })
		.click()
	await page
		.locator('ul[id="questions"] li')
		.first()
		.getByRole('button')
		.click()
	await expect(page.url()).toMatch(
		/^http:\/\/localhost:7777\/quiz\/\d+\/questions\/\d+\/correct/
	)
})

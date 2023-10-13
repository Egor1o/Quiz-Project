# Project 2: Quizlet 2.0

The project provides a web page that allows authenticated users to post questions
to topics managed by site administrators. Each question may have zero or more
answer options provided by users. When there are topics with questions and answers,
any user can access quizzes where they will be presented with questions related to
specific topics. Each question also includes information on whether it is correct
or not. After the user selects an answer, they will be redirected to a page
displaying the answer status. Additionally, the application has an API that can
send a random question with answer options in JSON format. Users can then
submit a JSON file with the question ID and receive a response indicating whether
the answer was correct or incorrect.

## Project launching:

1.  To launch the project, open the directory containing the docker-compose.yml file in the terminal.
2.  Launch the project by executing `docker-compose up`.

## Project manual testing:

1. During manual testing of the project through the UI, you can create an account by visiting the
   registration page accessible through the "Registration" link in the navigation bar or
   via the URL http://localhost:7777/auth/register. When registration is done, go to Login in navbar
   or via the URL http://localhost:7777/auth/login and complete the form to get on the topic page
2. For accessing all features provided by the web page locally, please log in as 'admin@admin.com'
   with the password '123456'.

## Project testing:

To test your project, execute the following command in the terminal:
`docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf`.
Do not forget about `docker-compose down` to remove credentials and `docker-compose up`.

## Project deploy:

You can also have a look on the project accessing the link: https://ancient-leaf-5615.fly.dev/

## IMPORTANT

If you are not using apple devices in testing, please change FROM `lukechannings/deno:v1.29.2` in Dockerfile
to `FROM denoland/deno:alpine-1.29.2`

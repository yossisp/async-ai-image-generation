### Prerequisites
- Install Typescript globally: `npm install -g typescript`.
- The project uses [dotenv](https://www.npmjs.com/package/dotenv) NPM package to export environment variables. Rename `.env.example` file to `.env` and populate the following veriables:
    1. `QSTASH_TOKEN` - get it [here](https://docs.upstash.com/qstash#2-get-your-token)
    2. `OPENAI_API_KEY` - get it [here](https://platform.openai.com/account/api-keys)
    3. `SERVER_URL` - the URL of the server which Qstash will make a request to, the server being the app. The app will be running on `localhost:3000` and a service like [ngrok](https://ngrok.com) can be used to expose the app to the world. If ngrok is used simply run `ngrok http 3000` in Terminal, copy the https URL and set `SERVER_URL` to it.

### Run
After completing the prerequisites section run `npm run dev`. This will start the application.

Make a `GET` request to the endpoint `/generate-image` with a prompt to generate an image:
```bash
curl -G  --data-urlencode "prompt=the most beautiful flower" localhost:3000/generate-image
```

The application will make a request to Qstash which will forward the request to OpenAI and call `/image-callback` endpoint with OpenAI response.

Lastly, `/get-image-is-ready` endpoint can be used to poll whether the image is ready using the submission id received from `/generate-image` response:
```bash
curl localhost:3000/get-image-is-ready?submissionId=YOUR_SUBMISSION_ID
```
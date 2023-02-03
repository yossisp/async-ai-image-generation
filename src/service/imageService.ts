import fetch from 'node-fetch'

const QSTASH_URL = `https://qstash.upstash.io/v1/publish/`;
const OPENAI_URL = "https://api.openai.com/v1/completions";

interface QstashSubmissionResponse {
    messageId: string
}

interface QstashResponse {
    body: string;
    headers: Record<string, Array<string>>
    status: string;
    sourceMessageId: string;
}

interface OpenAIResponseError {
    error: {
        message: string
    }
}

interface OpenAIResponseSuccess {
    choices?: [
        {
            text: string
        }?
    ]
}

export class ImageService {

    private readonly qstashToken: string
    private readonly openApiKey: string
    private readonly serverUrl: string

    constructor(
        qstashToken: string,
        openApiKey: string,
        serverUrl: string
    ) {
        this.qstashToken = qstashToken
        this.openApiKey = openApiKey
        this.serverUrl = serverUrl
    }

    public async submit(prompt?: string): Promise<string | undefined> {
        if (!prompt) {
            throw new Error("received empty prompt")
        }
        debugger
        const upstashCallback = this.serverUrl + '/image-callback'
        const response = await fetch(`${QSTASH_URL + OPENAI_URL}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.qstashToken}`,
                "upstash-forward-Authorization": `Bearer ${this.openApiKey}`,
                "Content-Type": "application/json",
                "Upstash-Callback": upstashCallback,
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt
            }),
        });
        console.log("made request to qstash")
        const json = await response.json() as any as QstashSubmissionResponse
        return json?.messageId
    }

    public getImage(qstashResponse: QstashResponse) {
        const body = qstashResponse.body
        const unencoded = Buffer.from(body, 'base64').toString()
        console.log('unencoded body', unencoded)
        const parsed = JSON.parse(unencoded) as OpenAIResponseError | OpenAIResponseSuccess
        if ('error' in parsed) {
            const errorResponse = parsed as OpenAIResponseError
            throw new Error(errorResponse.error.message)
        } else {
            const successResponse = parsed as OpenAIResponseSuccess
            return successResponse.choices?.[0]?.text
        }
    }
}
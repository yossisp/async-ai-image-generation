
const QSTASH_URL = `https://qstash.upstash.io/v1/publish/`;
const OPENAI_URL = "https://api.openai.com/v1/completions";
const MY_URL = "https://dalle-2.vercel.app";

interface QstashResponse {
    messageId: string
}

export class ImageGenerationService {

    private readonly qstashToken: string
    private readonly openApiKey: string

    constructor(
        qstashToken: string,
        openApiKey: string
        serverUrl: string
    ) {
        this.qstashToken = qstashToken
        this.openApiKey = openApiKey
    }

    public async submit(prompt?: string): Promise<string> {
        if (!prompt) {
            throw new Error("received empty prompt")
        }
        const upstashCallback = process.env.MY_URL + '/image-callback'
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
            const json: QstashResponse = await response.json();
            return json.messageId
    }
}
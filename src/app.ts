import * as dotenv from 'dotenv'
dotenv.config()

import express, { Application, Request, Response } from 'express'
import { ImageService } from './service/imageService'

interface RequestQuery {
    prompt?: string
}

const PORT: number = 3000
const QSTASH_TOKEN = process.env.QSTASH_TOKEN!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!
const SERVER_URL = process.env.SERVER_URL! // The URL of our application whose callback Qstash will invoke

const app: Application = express()
app.use(express.json())

app.get('/generate-image', async (req: Request, res: Response) => {
    debugger
    const imageGenerationService = new ImageService(
        QSTASH_TOKEN,
        OPENAI_API_KEY,
        SERVER_URL
    )
    
    const query: RequestQuery = req.query

    const submissionId = await imageGenerationService.submit(query.prompt)
    console.log('submissionId', submissionId)
    res.send('Generating image...')
})

app.post('/image-callback', async (req: Request, res: Response) => {
    debugger
    const imageService = new ImageService(
        QSTASH_TOKEN,
        OPENAI_API_KEY,
        SERVER_URL
    )
    
    const imageUrl = imageService.getImageUrl(req.body)
    res.sendStatus(200)
})

app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}.`)
})
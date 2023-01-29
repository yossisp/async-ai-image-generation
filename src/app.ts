import * as dotenv from 'dotenv'
dotenv.config()

import express, { Application, Request, Response } from 'express'
import { ImageGenerationService } from './service/imageGenerationService'

interface RequestQuery {
    prompt?: string
}

const PORT: number = 3000
const app: Application = express()

app.get('/generate-image', async (req: Request, res: Response) => {
    const imageGenerationService = new ImageGenerationService(
        process.env.QSTASH_TOKEN!,
        process.env.OPEN_API_KEY!,
        process.env.SERVER_URL! // The URL of our application whose callback Qstash will invoke
    )
    
    const query: RequestQuery = req.query

    await imageGenerationService.submit(query.prompt)
    res.send('Generating image...')
})

app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}.`)
})
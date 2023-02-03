import * as dotenv from 'dotenv'
dotenv.config()

import express, { Application, Request, Response } from 'express'
import { ImageService } from './service/imageService'

interface RequestQuery {
    prompt?: string
}

const PORT: number = 3000
const app: Application = express()
app.use(express.json())

app.get('/generate-image', async (req: Request, res: Response) => {
    debugger
    const imageGenerationService = new ImageService(
        process.env.QSTASH_TOKEN!,
        process.env.OPENAI_API_KEY!,
        process.env.SERVER_URL! // The URL of our application whose callback Qstash will invoke
    )
    
    const query: RequestQuery = req.query

    const submissionId = await imageGenerationService.submit(query.prompt)
    console.log('submissionId', submissionId)
    res.send('Generating image...')
})

app.post('/image-callback', async (req: Request, res: Response) => {
    debugger
    const imageService = new ImageService(
        process.env.QSTASH_TOKEN!,
        process.env.OPENAI_API_KEY!,
        process.env.SERVER_URL! // The URL of our application whose callback Qstash will invoke
    )
    
    const image = imageService.getImage(req.body)
    res.send()
})

app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}.`)
})
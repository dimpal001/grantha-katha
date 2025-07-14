import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Enable __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set the working directory
const directoryPath = __dirname

fs.readdirSync(directoryPath).forEach((file) => {
  const ext = path.extname(file).toLowerCase()

  if (ext === '.wav') {
    const inputPath = path.join(directoryPath, file)
    const outputPath = path.join(directoryPath, file.replace('.wav', '.mp3'))

    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', () => {
        console.log(`✅ Converted: ${file} → ${path.basename(outputPath)}`)
      })
      .on('error', (err) => {
        console.error(`❌ Error converting ${file}: ${err.message}`)
      })
      .save(outputPath)
  }
})

import { copyFileSync, existsSync, renameSync, statSync, unlinkSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"
import ffmpegPath from "ffmpeg-static"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const projectDir = dirname(scriptDir)
const publicDir = join(projectDir, "public")

const outputMp4Path = join(publicDir, "back.mp4")
const outputWebmPath = join(publicDir, "back.webm")
const backupMp4Path = join(publicDir, "back.original.mp4")
const posterPath = join(publicDir, "back-poster.jpg")
const tempMp4Path = join(publicDir, "back.optimized.mp4")

if (!ffmpegPath) {
  console.error("ffmpeg-static was not resolved. Reinstall dependency and retry.")
  process.exit(1)
}

const sourceMp4Path = existsSync(backupMp4Path) ? backupMp4Path : outputMp4Path

if (!existsSync(sourceMp4Path)) {
  console.error(`Source video missing: ${sourceMp4Path}`)
  process.exit(1)
}

if (!existsSync(backupMp4Path)) {
  copyFileSync(outputMp4Path, backupMp4Path)
  console.log("Created backup:", backupMp4Path)
}

const runFfmpeg = (label, args) => {
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" })
  if (result.error) {
    console.error(`Failed during ${label}:`, result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) {
    console.error(`ffmpeg exited with code ${result.status} during ${label}.`)
    process.exit(result.status ?? 1)
  }
}

runFfmpeg("mp4 optimization", [
  "-y",
  "-i",
  sourceMp4Path,
  "-an",
  "-vf",
  "scale='min(1280,iw)':-2:flags=lanczos,fps=30",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "28",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  tempMp4Path,
])

if (existsSync(outputMp4Path)) {
  unlinkSync(outputMp4Path)
}
renameSync(tempMp4Path, outputMp4Path)

runFfmpeg("webm generation", [
  "-y",
  "-i",
  sourceMp4Path,
  "-an",
  "-vf",
  "scale='min(1280,iw)':-2:flags=lanczos,fps=30",
  "-c:v",
  "libvpx-vp9",
  "-b:v",
  "0",
  "-crf",
  "34",
  "-row-mt",
  "1",
  "-pix_fmt",
  "yuv420p",
  outputWebmPath,
])

runFfmpeg("poster generation", [
  "-y",
  "-ss",
  "00:00:01.000",
  "-i",
  sourceMp4Path,
  "-frames:v",
  "1",
  "-q:v",
  "2",
  "-vf",
  "scale='min(1600,iw)':-2:flags=lanczos",
  posterPath,
])

if (existsSync(tempMp4Path)) {
  unlinkSync(tempMp4Path)
}

const toMb = (bytes) => (bytes / (1024 * 1024)).toFixed(2)
const sourceSize = statSync(sourceMp4Path).size
const mp4Size = statSync(outputMp4Path).size
const webmSize = statSync(outputWebmPath).size
const posterSize = statSync(posterPath).size

console.log("")
console.log("Media optimization completed:")
console.log(`- Source MP4: ${toMb(sourceSize)} MB (${sourceMp4Path})`)
console.log(`- Output MP4: ${toMb(mp4Size)} MB (${outputMp4Path})`)
console.log(`- Output WebM: ${toMb(webmSize)} MB (${outputWebmPath})`)
console.log(`- Poster JPG: ${toMb(posterSize)} MB (${posterPath})`)

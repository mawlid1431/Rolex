/** Keep only the latest scroll target while the browser decodes a video frame. */
export function createVideoScrubber(video: HTMLVideoElement) {
  let target = 0
  let frame = 0
  let disposed = false

  const flush = () => {
    frame = 0
    if (disposed || video.seeking || !Number.isFinite(video.duration) || video.duration <= 0) return
    // Seeking to the exact duration can display an empty frame in some browsers.
    const time = target * Math.max(0, video.duration - 0.04)
    if (Math.abs(video.currentTime - time) > 0.033) video.currentTime = time
  }
  const schedule = () => {
    if (!disposed && !frame) frame = requestAnimationFrame(flush)
  }
  video.addEventListener("loadedmetadata", schedule)
  video.addEventListener("seeked", schedule)
  return {
    seek(progress: number) {
      target = Math.min(1, Math.max(0, progress))
      schedule()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      video.removeEventListener("loadedmetadata", schedule)
      video.removeEventListener("seeked", schedule)
    },
  }
}

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react'
import { useMemoizedFn } from 'ahooks'

type IProps = {
  audioUrl: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onGetCurTime?: (time: number) => void
  onGetAllTime?: (time: number) => void
}

export type IMethods = {
  // 子组件暴露给父组件的方法
  replay: () => void
  play: () => void
  pause: () => void
}

const AudioPlayer: React.ForwardRefRenderFunction<IMethods, IProps> = (
  props,
  ref
) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { audioUrl, onGetAllTime, onGetCurTime } = props

  const handlePlay = useMemoizedFn(() => {
    props.onPlay && props.onPlay()
  })

  const handlePause = useMemoizedFn(() => {
    props.onPause && props.onPause()
  })

  const handleEnded = useMemoizedFn(() => {
    props.onEnded && props.onEnded()
  })

  const replay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }
  const play = () => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTimeSeconds = Math.floor(audioRef.current.currentTime)
      onGetCurTime && onGetCurTime(currentTimeSeconds)
    }
  }

  const handleLoaded = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration
      onGetAllTime && onGetAllTime(dur)
    }
  }

  // 将子组件的方法暴露给父组件
  useImperativeHandle(ref, () => ({
    replay,
    play,
    pause
  }))

  useEffect(() => {
    audioRef.current?.addEventListener('play', handlePlay)
    audioRef.current?.addEventListener('pause', handlePause)
    audioRef.current?.addEventListener('ended', handleEnded)
    audioRef.current?.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audioRef.current?.removeEventListener('play', handlePlay)
      audioRef.current?.removeEventListener('pause', handlePause)
      audioRef.current?.removeEventListener('ended', handleEnded)
      audioRef.current?.addEventListener('timeupdate', handleTimeUpdate)
    }
  }, [audioUrl])

  useEffect(() => {
    audioRef.current?.addEventListener('canplay', handleLoaded)

    return () => {
      audioRef.current?.removeEventListener('canplay', handleLoaded)
    }
  }, [])

  return (
    <audio
      className="common-audio-component"
      preload="metadata"
      src={audioUrl}
      ref={audioRef}
    ></audio>
  )
}

export default forwardRef(AudioPlayer)

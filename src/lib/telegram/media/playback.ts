import type { CheerioAPI } from 'cheerio'
import type { IndexedStaticProxyOptions, MessageSelection, StaticProxyOptions } from '../types'
import { getProxiedUrl } from '../url'
import { getVideoPreload } from './utils'

function applyVideoAttrs(video: MessageSelection, staticProxy: string, index: number): void {
  const src = video.attr('src')

  if (src) {
    video.attr('src', getProxiedUrl(staticProxy, src))
  }

  video
    .attr('controls', '')
    .attr('preload', getVideoPreload(index))
    .attr('playsinline', '')
    .attr('webkit-playsinline', '')
}

export function getVideo($: CheerioAPI, message: MessageSelection, options: IndexedStaticProxyOptions): string {
  const { staticProxy = '', index = 0 } = options
  const video = message.find('.tgme_widget_message_video_wrap video')
  applyVideoAttrs(video, staticProxy, index)

  const roundVideo = message.find('.tgme_widget_message_roundvideo_wrap video')
  applyVideoAttrs(roundVideo, staticProxy, index)

  return $.html(video) + $.html(roundVideo)
}

export function getAudio($: CheerioAPI, message: MessageSelection, options: StaticProxyOptions): string {
  const { staticProxy = '' } = options
  const audio = message.find('.tgme_widget_message_voice')
  const audioSrc = audio.attr('src')

  if (audioSrc) {
    audio.attr('src', getProxiedUrl(staticProxy, audioSrc))
  }

  audio.attr('controls', '')
  return $.html(audio)
}

import { load } from 'cheerio'
import { describe, expect, it } from 'vitest'
import { getLinkPreview } from './link-preview'

function renderLinkPreview(html: string, options: Record<string, unknown> = {}) {
  const $ = load(`<div class="message">${html}</div>`)
  return load(getLinkPreview($, $('.message'), options))
}

describe('link preview renderer', () => {
  it('proxies and enables controls for link preview videos', () => {
    const rendered = renderLinkPreview(`
      <a class="tgme_widget_message_link_preview" href="https://fxtwitter.com/x/status/1">
        <div class="link_preview_site_name accent_color">FxTwitter</div>
        <div class="link_preview_video_player js-message_video_player">
          <div class="link_preview_video_wrap" style="padding-top:56.25%">
            <video class="link_preview_video js-message_video"
              src="https://cdn4.telesco.pe/file/video.mp4?token=abc"
              width="100%" height="100%" jm_neat="524878850"></video>
          </div>
          <div class="message_video_play js-message_video_play"></div>
          <time class="message_video_duration js-message_video_duration">1:59</time>
        </div>
        <div class="link_preview_title">海外工作说 (@visa6363)</div>
        <div class="link_preview_description">描述</div>
      </a>
    `, { staticProxy: '/static/' })

    const video = rendered('video')

    expect(video).toHaveLength(1)
    expect(video.attr('src')).toBe('/static/https://cdn4.telesco.pe/file/video.mp4?token=abc')
    expect(video.attr('controls')).toBeDefined()
    expect(video.attr('playsinline')).toBeDefined()
    expect(video.attr('preload')).toBe('auto')
  })

  it('uses metadata preload for late posts', () => {
    const rendered = renderLinkPreview(`
      <a class="tgme_widget_message_link_preview" href="https://fxtwitter.com/x/status/1">
        <div class="link_preview_video_player js-message_video_player">
          <div class="link_preview_video_wrap" style="padding-top:56.25%">
            <video class="link_preview_video js-message_video" src="https://cdn4.telesco.pe/file/video.mp4"></video>
          </div>
        </div>
        <div class="link_preview_title">t</div>
      </a>
    `, { staticProxy: '', index: 20 })

    expect(rendered('video').attr('preload')).toBe('metadata')
  })

  it('rewrites link preview image src through the proxy', () => {
    const rendered = renderLinkPreview(`
      <a class="tgme_widget_message_link_preview" href="https://example.com/">
        <div class="link_preview_image" style="background-image:url('https://cdn4.telesco.pe/file/thumb.jpg')"></div>
        <div class="link_preview_title">t</div>
      </a>
    `, { staticProxy: '/static/' })

    const image = rendered('img.link_preview_image')

    expect(image.attr('src')).toBe('/static/https://cdn4.telesco.pe/file/thumb.jpg')
  })
})

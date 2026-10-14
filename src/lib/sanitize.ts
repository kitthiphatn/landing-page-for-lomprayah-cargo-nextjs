import sanitizeHtml from 'sanitize-html'

// What editors may use in an HTML block. Anything else (scripts, event handlers such as
// onclick, javascript: links, forms, embeds from unknown sites) is removed.
const options: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img',
    'figure',
    'figcaption',
    'iframe',
    'video',
    'source',
    'span',
    'u',
    's',
    'mark',
    'small',
    'sub',
    'sup',
  ],
  allowedAttributes: {
    '*': ['class', 'style', 'id', 'title', 'dir', 'lang'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'srcset', 'alt', 'width', 'height', 'loading'],
    iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'loading'],
    video: ['src', 'controls', 'width', 'height', 'poster', 'muted', 'loop', 'playsinline'],
    source: ['src', 'type'],
    td: ['colspan', 'rowspan', 'align'],
    th: ['colspan', 'rowspan', 'align', 'scope'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  // Embeds only from these sites
  allowedIframeHostnames: [
    'www.youtube.com',
    'youtube.com',
    'www.youtube-nocookie.com',
    'www.google.com',
    'maps.google.com',
    'www.facebook.com',
    'player.vimeo.com',
    'www.tiktok.com',
  ],
  allowedStyles: {
    '*': {
      color: [/^[#a-z0-9(),.\s%]+$/i],
      'background-color': [/^[#a-z0-9(),.\s%]+$/i],
      'text-align': [/^(left|right|center|justify)$/],
      'font-weight': [/^(normal|bold|[1-9]00)$/],
      'font-style': [/^(normal|italic)$/],
      'text-decoration': [/^[a-z\s-]+$/],
      'font-size': [/^\d+(\.\d+)?(px|em|rem|%)$/],
      width: [/^\d+(\.\d+)?(px|em|rem|%)$|^auto$/],
      height: [/^\d+(\.\d+)?(px|em|rem|%)$|^auto$/],
      'max-width': [/^\d+(\.\d+)?(px|em|rem|%)$/],
      margin: [/^[\d\s.a-z%-]+$/],
      padding: [/^[\d\s.a-z%-]+$/],
      border: [/^[#a-z0-9(),.\s%-]+$/i],
      'border-radius': [/^[\d\s.a-z%]+$/],
    },
  },
  // An embed whose address was removed would leave an empty box
  exclusiveFilter: (frame) => frame.tag === 'iframe' && !frame.attribs.src,
  transformTags: {
    // Links that open a new tab can't control the page that opened them
    a: (tagName, attribs) =>
      attribs.target === '_blank'
        ? { tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }
        : { tagName, attribs },
  },
}

export function sanitize(html: string): string {
  return sanitizeHtml(html, options)
}

// Full-page HTML (its own <head>, <style>, Tailwind or icon fonts) is shown in an isolated
// frame instead, so its styles can't leak into the site and the site's can't break it.
const PAGE_SCRIPT_SOURCES = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/@tailwindcss/browser',
]
const PAGE_STYLESHEET_HOSTS = [
  'fonts.googleapis.com',
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
]

const allowedScript = (src: string | undefined) =>
  !!src &&
  PAGE_SCRIPT_SOURCES.some(
    (prefix) =>
      src === prefix ||
      src.startsWith(prefix + '/') ||
      src.startsWith(prefix + '@') ||
      src.startsWith(prefix + '?'),
  )

const allowedStylesheet = (href: string | undefined) => {
  if (!href) return false
  try {
    const url = new URL(href)
    return url.protocol === 'https:' && PAGE_STYLESHEET_HOSTS.includes(url.hostname)
  } catch {
    return false
  }
}

const pageOptions: sanitizeHtml.IOptions = {
  ...options,
  allowedTags: [
    ...(options.allowedTags as string[]),
    'html',
    'head',
    'body',
    'meta',
    'title',
    'style',
    'link',
    'script',
    'i',
  ],
  allowedAttributes: {
    ...(options.allowedAttributes as Record<string, string[]>),
    '*': ['class', 'style', 'id', 'title', 'dir', 'lang', 'role', 'aria-*', 'data-*'],
    html: ['lang', 'class'],
    meta: ['charset', 'name', 'content'],
    link: ['rel', 'href', 'crossorigin'],
    script: ['src'],
  },
  // CSS may be anything here: the frame keeps it away from the rest of the site
  allowedStyles: undefined,
  allowVulnerableTags: true,
  exclusiveFilter: (frame) => {
    if (frame.tag === 'iframe') return !frame.attribs.src
    // Only Tailwind from its official CDN; inline code and any other script is dropped
    if (frame.tag === 'script') return !!frame.text.trim() || !allowedScript(frame.attribs.src)
    if (frame.tag === 'link')
      return frame.attribs.rel !== 'stylesheet' || !allowedStylesheet(frame.attribs.href)
    return false
  },
}

export function isFullPage(html: string): boolean {
  return /<(html|head|body|style|link)\b|<script\b[^>]*\bsrc=/i.test(html)
}

// Cleans an HTML block the way it will be shown
export function sanitizeBlock(html: string): string {
  return isFullPage(html) ? sanitizeHtml(html, pageOptions) : sanitize(html)
}

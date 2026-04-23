'use client'
import { useEffect } from 'react'

/**
 * NgfEditBridge — enables the NGF portal's live preview and click-to-edit.
 * Must be included in app/layout.tsx. Do not remove.
 */
export default function NgfEditBridge() {
  useEffect(() => {
    let editMode = false

    const style = document.createElement('style')
    style.id = 'ngf-edit-styles'
    style.textContent = `
      [data-ngf-edit="true"] [data-ngf-field] {
        outline: 1.5px dashed rgba(59,130,246,0.45) !important;
        border-radius: 3px;
        cursor: pointer !important;
      }
      [data-ngf-edit="true"] [data-ngf-field]:hover {
        outline-color: #3b82f6 !important;
        background-color: rgba(59,130,246,0.06) !important;
      }
      /* Empty field placeholder — keeps blank fields clickable in edit mode */
      [data-ngf-edit="true"] [data-ngf-field]:empty {
        min-height: 1.2em;
        min-width: 60px;
        display: inline-block;
      }
      [data-ngf-edit="true"] [data-ngf-field]:empty::before {
        content: attr(data-ngf-label);
        color: #94a3b8;
        font-style: italic;
        pointer-events: none;
      }
      /* Pulse highlight when editor scrolls to a field */
      [data-ngf-field].ngf-field-focus {
        animation: ngfFieldFocus 1.6s ease-out;
      }
      @keyframes ngfFieldFocus {
        0%   { outline-color: #3b82f6 !important; background-color: rgba(59,130,246,0.25) !important; }
        100% { outline-color: rgba(59,130,246,0.45) !important; background-color: transparent !important; }
      }

      /* Navigation popup injected by NgfEditBridge */
      #ngf-nav-popup {
        position: fixed;
        z-index: 2147483647;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        box-shadow: 0 4px 24px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08);
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 170px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        pointer-events: auto !important;
      }
      #ngf-nav-popup-label {
        font-size: 11px;
        color: #94a3b8;
        padding: 4px 10px 2px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
      }
      #ngf-nav-popup .ngf-nav-btn {
        all: unset;
        display: block;
        width: 100%;
        box-sizing: border-box;
        padding: 7px 10px;
        border-radius: 7px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.12s;
        white-space: nowrap;
        pointer-events: auto !important;
      }
      #ngf-nav-popup .ngf-go-btn {
        color: #1d4ed8;
        background: #eff6ff;
      }
      #ngf-nav-popup .ngf-go-btn:hover {
        background: #dbeafe;
      }
      #ngf-nav-popup .ngf-edit-btn {
        color: #0f172a;
        background: transparent;
      }
      #ngf-nav-popup .ngf-edit-btn:hover {
        background: #f3f4f6;
      }
    `
    document.head.appendChild(style)

    // ── Nav popup helpers ──────────────────────────────────────────────────────
    let navPopup: HTMLDivElement | null = null

    function dismissNavPopup() {
      navPopup?.remove()
      navPopup = null
    }

    type EditTarget = {
      section: string
      field: string
      value: string
      rect: DOMRect
    }

    function postFieldClick(t: EditTarget) {
      window.parent.postMessage(
        {
          type:    'fieldClick',
          section: t.section,
          field:   t.field,
          currentValue: t.value,
          elementRect: {
            top:    t.rect.top,
            left:   t.rect.left,
            bottom: t.rect.bottom,
            right:  t.rect.right,
            width:  t.rect.width,
            height: t.rect.height,
          },
        },
        '*',
      )
    }

    function showNavPopup(
      href: string,
      label: string,
      clientX: number,
      clientY: number,
      editTarget?: EditTarget,
    ) {
      dismissNavPopup()

      const popup = document.createElement('div')
      popup.id = 'ngf-nav-popup'

      const lbl = document.createElement('div')
      lbl.id = 'ngf-nav-popup-label'
      lbl.textContent = label || 'Link'
      popup.appendChild(lbl)

      const goBtn = document.createElement('button')
      goBtn.className = 'ngf-nav-btn ngf-go-btn'
      goBtn.textContent = '→  Go to page'
      goBtn.addEventListener('click', (ev) => {
        ev.stopPropagation()
        dismissNavPopup()
        window.location.href = href
      })
      popup.appendChild(goBtn)

      if (editTarget) {
        const editBtn = document.createElement('button')
        editBtn.className = 'ngf-nav-btn ngf-edit-btn'
        editBtn.textContent = '✎  Edit'
        editBtn.addEventListener('click', (ev) => {
          ev.stopPropagation()
          dismissNavPopup()
          postFieldClick(editTarget)
        })
        popup.appendChild(editBtn)
      }

      popup.style.visibility = 'hidden'
      document.body.appendChild(popup)
      navPopup = popup

      const pw = popup.offsetWidth || 180
      const ph = popup.offsetHeight || 110
      const vw = window.innerWidth
      const vh = window.innerHeight
      let left = clientX
      let top = clientY + 10
      if (left + pw + 8 > vw) left = vw - pw - 8
      if (top + ph + 8 > vh) top = clientY - ph - 10
      popup.style.left = `${Math.max(8, left)}px`
      popup.style.top = `${Math.max(8, top)}px`
      popup.style.visibility = ''
    }

    // ── Default-text cache ────────────────────────────────────────────────────
    // Capture the server-rendered textContent of every annotated field on first
    // sight. Stored on the element itself (dataset.ngfDefault) so it survives
    // later DOM mutations. The editor sends empty strings (or omits keys) to
    // mean "restore to default" — that only works if we remember the default.
    function captureDefaults() {
      document.querySelectorAll<HTMLElement>('[data-ngf-field]').forEach(el => {
        if (el.dataset.ngfDefault === undefined) {
          el.dataset.ngfDefault = el.textContent ?? ''
        }
      })
    }
    captureDefaults()

    window.parent.postMessage({ type: 'ngfReady' }, '*')

    const messageHandler = (e: MessageEvent) => {
      if (e.data?.type === 'setEditMode') {
        editMode = !!e.data.enabled
        document.documentElement.setAttribute('data-ngf-edit', editMode ? 'true' : 'false')
        // Re-run in case fields were hydrated after initial capture
        captureDefaults()
        if (!editMode) dismissNavPopup()
      }

      if (e.data?.type === 'contentUpdate' && e.data.content) {
        const walk = (obj: unknown, path: string) => {
          if (obj === null || obj === undefined) return
          if (typeof obj === 'string') {
            const el = document.querySelector<HTMLElement>(`[data-ngf-field="${path}"]`)
            if (el) {
              // Empty string = restore the original SSR text (the hardcoded
              // fallback the page renders for an unpopulated field). A real
              // user-entered value overwrites.
              el.textContent = obj === '' ? (el.dataset.ngfDefault ?? '') : obj
            }
            return
          }
          if (Array.isArray(obj)) {
            obj.forEach((item, i) => walk(item, `${path}.${i}`))
            return
          }
          if (typeof obj === 'object') {
            for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
              walk(v, path ? `${path}.${k}` : k)
            }
          }
        }
        walk(e.data.content, '')
      }

      // Editor asks us to scroll the iframe to a specific field + flash it
      if (e.data?.type === 'scrollToField' && typeof e.data.path === 'string') {
        const el = document.querySelector<HTMLElement>(`[data-ngf-field="${e.data.path}"]`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.remove('ngf-field-focus')
          // Restart animation
          void el.offsetWidth
          el.classList.add('ngf-field-focus')
          setTimeout(() => el.classList.remove('ngf-field-focus'), 1700)
        }
      }
    }

    // ── Click handler ─────────────────────────────────────────────────────────
    const clickHandler = (e: MouseEvent) => {
      if (!editMode) return
      if (navPopup && navPopup.contains(e.target as Node)) return
      if (navPopup) dismissNavPopup()

      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()

      // Single upward walk finds the nearest anchor AND nearest field.
      let cursor: HTMLElement | null = e.target as HTMLElement | null
      let anchor: HTMLAnchorElement | null = null
      let fieldEl: HTMLElement | null = null
      let buttonEl: HTMLButtonElement | null = null
      while (cursor && cursor !== document.documentElement) {
        const tag = cursor.tagName?.toLowerCase()
        if (!anchor   && tag === 'a')                                anchor   = cursor as HTMLAnchorElement
        if (!buttonEl && tag === 'button')                           buttonEl = cursor as HTMLButtonElement
        if (!fieldEl  && cursor.getAttribute?.('data-ngf-field'))    fieldEl  = cursor
        cursor = cursor.parentElement
      }

      // Build an EditTarget from the field element, if any
      let editTarget: EditTarget | undefined
      if (fieldEl) {
        const attr = fieldEl.getAttribute('data-ngf-field') ?? ''
        const dot = attr.indexOf('.')
        if (dot > -1) {
          editTarget = {
            section: attr.substring(0, dot),
            field:   attr.substring(dot + 1),
            value:   fieldEl.textContent?.trim() ?? '',
            rect:    fieldEl.getBoundingClientRect(),
          }
        }
      }

      // Precedence:
      //   1. Anchor (internal hash) → scroll, no popup (even if editable — feels disorienting)
      //   2. Anchor (real href) → popup with Go to page + Edit (if editable)
      //   3. Editable field outside any link → fire fieldClick directly
      //   4. Button (no link, no field) → silently block (e.g. mobile menu toggle)

      if (anchor) {
        const href = anchor.getAttribute('href') ?? ''
        if (href.startsWith('#')) {
          const id = href.slice(1)
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          return
        }
        if (href && href !== '#') {
          const label = anchor.textContent?.trim() || anchor.getAttribute('aria-label') || 'Link'
          showNavPopup(anchor.href, label, e.clientX, e.clientY, editTarget)
          return
        }
        // Anchor with no href — treat as plain editable (if any)
      }

      if (editTarget) {
        postFieldClick(editTarget)
        return
      }

      // Button click with nothing editable — just block
      if (buttonEl) return
    }

    window.addEventListener('message', messageHandler)
    document.addEventListener('click', clickHandler, true)

    return () => {
      window.removeEventListener('message', messageHandler)
      document.removeEventListener('click', clickHandler, true)
      document.getElementById('ngf-edit-styles')?.remove()
      document.documentElement.removeAttribute('data-ngf-edit')
      dismissNavPopup()
    }
  }, [])

  return null
}

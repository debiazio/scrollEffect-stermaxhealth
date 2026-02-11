import React, { useEffect } from 'react'

const ISO = 'ISO:13485'
const FRASE = 'e fabricada em conformidade com a norma internacional'

function norm(s: string) {
  return (s || '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function runOnce(root: ParentNode = document) {
  const isoN = norm(ISO)
  const fraseN = norm(FRASE)

  let lisRemovidos = 0
  let textosRemovidos = 0
  let isoOcultados = 0

  // 1) Remove <li> inteiro que contenha ISO
  root.querySelectorAll?.('li')?.forEach((li) => {
    const texto = norm(li.textContent || '')
    if (texto.includes(isoN)) {
      li.remove()
      lisRemovidos++
    }
  })

  // 2) Remove o trecho textual (mesmo que ISO esteja em <strong>)
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node: Node | null

  while ((node = walker.nextNode())) {
    const t = norm(node.textContent || '')
    if (t.includes(fraseN)) {
      // remove só esse nó de texto
      node.textContent = ''
      textosRemovidos++

      // esconde o <strong>ISO:13485</strong> próximo (normalmente no mesmo container)
      const parent = (node as any).parentElement as HTMLElement | null
      if (parent) {
        parent.querySelectorAll('strong').forEach((s) => {
          if (norm(s.textContent || '') === isoN) {
            ;(s as HTMLElement).style.display = 'none'
            isoOcultados++
          }
        })
      }
    }
  }

  return { lisRemovidos, textosRemovidos, isoOcultados }
}

const HideISO: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // roda já na carga
    // const first = runOnce(document)
    // opcional: log pra debug (remova depois)
    // console.log('[HideISO] inicial', first)

    // observa mudanças (VTEX frequentemente re-renderiza conteúdos)
    const obs = new MutationObserver(() => {
      runOnce(document)
    })

    obs.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => obs.disconnect()
  }, [])

  // componente “invisível”
  return null
}

export default HideISO

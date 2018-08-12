import Link from './Link'

// @vue/component
export default {
  name: 'GridsomePager',
  functional: true,

  props: {
    info: { type: Object, required: true },
    showLinks: { type: Boolean, default: true },
    showNavigation: { type: Boolean, default: true },
    firstLabel: { type: String, default: '«' },
    prevLabel: { type: String, default: '‹' },
    nextLabel: { type: String, default: '›' },
    lastLabel: { type: String, default: '»' },
    linkClass: { type: String, default: '' },

    // accessibility
    ariaLabel: { type: String, default: 'Pagination Navigation' },
    ariaLinkLabel: { type: String, default: 'Go to page %n' },
    ariaFirstLabel: { type: String, default: 'Go to first page' },
    ariaCurrentLabel: { type: String, default: 'Current page. Page %n' },
    ariaPrevLabel: { type: String, default: 'Go to previous page. Page %n' },
    ariaNextLabel: { type: String, default: 'Go to next page. Page %n' },
    ariaLastLabel: { type: String, default: 'Go to last page. Page %n' }
  },

  render: (h, { props, data }) => {
    const { info, showLinks, showNavigation, ariaLabel } = props
    const { current, total, pages, start, end } = resolveRange(info)

    const renderLink = (page, text = page, ariaLabel = text) => {
      if (page === current) ariaLabel = props.ariaCurrentLabel

      return h(Link, {
        staticClass: props.linkClass,
        props: { page },
        attrs: {
          'aria-label': ariaLabel.replace('%n', page),
          'aria-current': current === page
        }
      }, [text])
    }

    const links = showLinks
      ? pages.map(page => renderLink(page, page, props.ariaLinkLabel))
      : []

    // render first, prev, next and last links
    if (showNavigation) {
      const { firstLabel, prevLabel, nextLabel, lastLabel } = props
      const { ariaFirstLabel, ariaPrevLabel, ariaNextLabel, ariaLastLabel } = props

      if (current > 1) links.unshift(renderLink(current - 1, prevLabel, ariaPrevLabel))
      if (start > 0) links.unshift(renderLink(1, firstLabel, ariaFirstLabel))
      if (current < total) links.push(renderLink(current + 1, nextLabel, ariaNextLabel))
      if (end < total) links.push(renderLink(total, lastLabel, ariaLastLabel))
    }

    if (links.length < 2) return null

    return h('nav', {
      ...data,
      attrs: {
        'role': 'navigation',
        'aria-label': ariaLabel
      }
    }, links)
  }
}

function resolveRange ({
  currentPage: current = 1,
  totalPages: total = 1
}) {
  const length = 10
  const offset = Math.ceil(length / 2)

  let start = current - offset
  let end = current + offset

  if (total <= length) {
    start = 0
    end = total
  } else if (current <= offset) {
    start = 0
    end = length
  } else if ((current + offset) >= total) {
    start = total - length
    end = total
  }

  const pages = []

  for (let page = start + 1; page <= end; page++) {
    pages.push(page)
  }

  return { current, total, start, end, pages }
}

// Форматируем цену: добавляем пробелы между тысячами (например, 11 540)
export function formatPrice(price) {
  return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Инициализируем библиотеку Tippy.js для всех кнопок-тултипов внутри контейнера
export function initTooltips(container) {
  const tooltipBtns = container.querySelectorAll('.tooltip__btn')

  tooltipBtns.forEach(function (btn) {
    const content = btn.nextElementSibling // берем соседний блок .tooltip__content

    if (content && window.tippy) {
      window.tippy(btn, {
        content: content.innerHTML,
        allowHTML: true,
        placement: 'top-end',
        arrow: false,
      })
    }
  });
}
export function initAccordion() {
  const accordionButtons = document.querySelectorAll('.accordion__btn')

  accordionButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const isActive = button.classList.contains('accordion__btn--active')

      accordionButtons.forEach(function (currentButton) {
        currentButton.classList.remove('accordion__btn--active')
      })

      if (!isActive) {
        button.classList.add('accordion__btn--active')
      }
    })
  })
}
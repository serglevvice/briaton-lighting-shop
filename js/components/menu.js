export function initMenu() {
  const catalogBtn = document.querySelector('.header__catalog-btn')
  const mainMenu = document.querySelector('.main-menu')
  const closeBtn = document.querySelector('.main-menu__close')

  catalogBtn.addEventListener('click', function () {
    mainMenu.classList.add('main-menu--active')
  })

  closeBtn.addEventListener('click', function () {
    mainMenu.classList.remove('main-menu--active')
  })
}
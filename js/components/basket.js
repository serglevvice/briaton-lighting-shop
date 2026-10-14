import { formatPrice } from './utils.js'

const STORAGE_KEY = 'briaton_basket'

// Пытаемся достать сохраненные товары из localStorage при запуске
let basketProducts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []

const basketBtn = document.querySelector('.header__user-item:first-child .header__user-btn')
const basket = document.querySelector('.basket')
const basketList = document.querySelector('.basket__list')
const basketCount = document.querySelector('.header__user-count')
const basketEmpty = document.querySelector('.basket__empty-block')
const basketLink = document.querySelector('.basket__link') // Кнопка "Перейти к оформлению"

// Функция сохранения в localStorage
function saveBasketToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(basketProducts))
}

function updateBasketView() {
  basketList.innerHTML = ''
  basketCount.textContent = basketProducts.length

  if (basketProducts.length === 0) {
    basketEmpty.style.display = 'block'
    if (basketLink) basketLink.style.display = 'none'
    return
  }

  basketEmpty.style.display = 'none'
  if (basketLink) basketLink.style.display = 'flex'

  basketProducts.forEach(function (product) {
    const item = document.createElement('li')
    item.classList.add('basket__item')

    item.innerHTML = `
      <div class="basket__img">
        <img src="${product.image.replace('../', '')}" alt="${product.name}" height="60" width="60">
      </div>

      <span class="basket__name">${product.name}</span>
      <span class="basket__price">${formatPrice(product.price.new)} руб.</span>

      <button class="basket__item-close" type="button" data-id="${product.basketId}" aria-label="Удалить товар">
        <svg class="main-menu__icon" width="24" height="24" aria-hidden="true">
          <use xlink:href="images/sprite.svg#icon-close"></use>
        </svg>
      </button>
    `

    const closeBtn = item.querySelector('.basket__item-close')

    closeBtn.addEventListener('click', function () {
      const basketId = Number(closeBtn.dataset.id)

      basketProducts = basketProducts.filter(function (item) {
        return item.basketId !== basketId
      })

      saveBasketToStorage()
      updateBasketView()
    })

    basketList.append(item)
  })
}

export function addProductToBasket(product) {
  const basketProduct = {
    ...product,
    basketId: Date.now() + Math.random()
  }

  basketProducts.push(basketProduct)
  saveBasketToStorage()
  updateBasketView()
}

export function initBasket() {
  basketBtn.addEventListener('click', function () {
    basket.classList.toggle('basket--active')
  })

  updateBasketView()
}

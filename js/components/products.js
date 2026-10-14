import { addProductToBasket } from './basket.js'
import { formatPrice, initTooltips } from './utils.js'

const PRODUCTS_PER_PAGE = 6
let currentPage = 1
let products = []

const typeNames = ['pendant', 'ceiling', 'overhead', 'point', 'nightlights']

function isProductAvailable(product) {
  return (
    product.availability.moscow > 0 ||
    product.availability.orenburg > 0 ||
    product.availability.saintPetersburg > 0
  )
}

function createProductCard(product) {
  const item = document.createElement('li')
  item.classList.add('catalog__item')

  item.innerHTML = `
    <div class="product-card">
      <div class="product-card__visual">
        <img class="product-card__img" src="${product.image.replace('../', '')}" height="436" width="290" alt="${product.name}">
        <div class="product-card__more">
          <button type="button" class="product-card__link btn btn--icon" data-id="${product.id}">
            <span class="btn__text">В корзину</span>
            <svg width="24" height="24" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-basket"></use>
            </svg>
          </button>
          <a href="#questions-form" class="product-card__link btn btn--secondary">
            <span class="btn__text">Подробнее</span>
          </a>
        </div>
      </div>

      <div class="product-card__info">
        <h2 class="product-card__title">${product.name}</h2>

        <span class="product-card__old">
          <span class="product-card__old-number">${formatPrice(product.price.old)}</span>
          <span class="product-card__old-add">₽</span>
        </span>

        <span class="product-card__price">
          <span class="product-card__price-number">${formatPrice(product.price.new)}</span>
          <span class="product-card__price-add">₽</span>
        </span>

        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" type="button" aria-label="Показать подсказку">
            <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-i"></use>
            </svg>
          </button>
          <div class="tooltip__content">
            <span class="tooltip__text">Наличие товара по городам:</span>
            <ul class="tooltip__list">
              <li class="tooltip__item">
                <span class="tooltip__text">Москва: <span class="tooltip__count">${product.availability.moscow}</span></span>
              </li>
              <li class="tooltip__item">
                <span class="tooltip__text">Оренбург: <span class="tooltip__count">${product.availability.orenburg}</span></span>
              </li>
              <li class="tooltip__item">
                <span class="tooltip__text">Санкт-Петербург: <span class="tooltip__count">${product.availability.saintPetersburg}</span></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `

  const basketBtn = item.querySelector('.btn--icon')

  basketBtn.addEventListener('click', function (event) {
    event.preventDefault()
    addProductToBasket(product)
  })

  return item
}

function renderProducts(productList) {
  const catalogList = document.querySelector('.catalog__list')
  catalogList.innerHTML = ''

  // Если после фильтрации товаров не осталось — показываем понятное сообщение
  if (productList.length === 0) {
    catalogList.innerHTML = '<li style="grid-column: 1 / -1; padding: 40px 0; text-align: center; font-size: 18px;">По вашему запросу товаров не найдено. Попробуйте сбросить фильтры.</li>'
    renderPagination([])
    return
  }

  const start = (currentPage - 1) * PRODUCTS_PER_PAGE
  const end = start + PRODUCTS_PER_PAGE
  const productsOnPage = productList.slice(start, end)

  productsOnPage.forEach(function (product) {
    const card = createProductCard(product)
    catalogList.append(card)
  })

  // Инициализируем тултипы Tippy.js для отрисованных карточек
  initTooltips(catalogList)
  renderPagination(productList)
}

function renderPagination(productList) {
  const pagination = document.querySelector('.catalog__pagination')
  pagination.innerHTML = ''

  const pagesCount = Math.ceil(productList.length / PRODUCTS_PER_PAGE)

  if (pagesCount <= 1) {
    return
  }

  for (let i = 1; i <= pagesCount; i++) {
    const item = document.createElement('li')
    item.classList.add('catalog__pagination-item')

    const button = document.createElement('button')
    button.classList.add('catalog__pagination-link')
    button.textContent = i

    if (i === currentPage) {
      button.classList.add('catalog__pagination-link--active')
      button.disabled = true
    }

    button.addEventListener('click', function () {
      currentPage = i
      updateCatalog()
    })

    item.append(button)
    pagination.append(item)
  }
}

function renderTypeCounts() {
  for (let i = 0; i < typeNames.length; i++) {
    const type = typeNames[i]
    const checkbox = document.querySelector(`input[name="type"][value="${type}"]`)

    if (!checkbox) {
      continue
    }

    const label = checkbox.closest('.custom-checkbox')
    const countElement = label.querySelector('.custom-checkbox__count')

    let count = 0

    products.forEach(function (product) {
      if (product.type.includes(type)) {
        count = count + 1
      }
    })

    countElement.textContent = count
  }
}

function getSelectedTypes() {
  const checkedTypes = document.querySelectorAll('input[name="type"]:checked')
  const selectedTypes = []

  checkedTypes.forEach(function (checkbox) {
    selectedTypes.push(checkbox.value)
  })

  return selectedTypes
}

function getSelectedStatus() {
  const checkedStatus = document.querySelector('input[name="status"]:checked')
  return checkedStatus ? checkedStatus.value : 'all-item'
}

function filterProducts(productList) {
  const selectedTypes = getSelectedTypes()
  const selectedStatus = getSelectedStatus()

  return productList.filter(function (product) {
    let typeMatches = true
    let statusMatches = true

    if (selectedTypes.length > 0) {
      typeMatches = selectedTypes.some(function (type) {
        return product.type.includes(type)
      })
    }

    if (selectedStatus === 'instock') {
      statusMatches = isProductAvailable(product)
    }

    return typeMatches && statusMatches
  })
}

function sortProducts(productList) {
  const sortSelect = document.querySelector('.catalog__sort-select')
  const sortValue = sortSelect.value
  const copy = productList.slice()

  copy.sort(function (a, b) {
    if (sortValue === 'price-min') {
      return a.price.new - b.price.new
    }

    if (sortValue === 'price-max') {
      return b.price.new - a.price.new
    }

    if (sortValue === 'rating-max') {
      return b.rating - a.rating
    }

    return 0
  })

  return copy
}

function updateCatalog() {
  const filteredProducts = filterProducts(products)
  const sortedProducts = sortProducts(filteredProducts)

  renderProducts(sortedProducts)
}

function initFilters() {
  const typeCheckboxes = document.querySelectorAll('input[name="type"]')
  const statusRadios = document.querySelectorAll('input[name="status"]')
  const sortSelect = document.querySelector('.catalog__sort-select')
  const resetBtn = document.querySelector('.catalog-form__reset')

  typeCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      currentPage = 1
      updateCatalog()
    })
  })

  statusRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      currentPage = 1
      updateCatalog()
    })
  })

  sortSelect.addEventListener('change', function () {
    currentPage = 1
    updateCatalog()
  })

  resetBtn.addEventListener('click', function () {
    currentPage = 1
    setTimeout(function () {
      updateCatalog()
    }, 0)
  })
}

async function loadProducts() {
  const catalogList = document.querySelector('.catalog__list')

  try {
    const response = await fetch('./data/data.json')

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }

    const data = await response.json()
    products = data

    renderTypeCounts()
    updateCatalog()
    initFilters()
  } catch (error) {
    console.error('Ошибка при загрузке каталога:', error)
    if (catalogList) {
      catalogList.innerHTML = '<li style="grid-column: 1 / -1; padding: 40px 0; text-align: center; color: #b81111;">Не удалось загрузить каталог товаров. Пожалуйста, обновите страницу позже.</li>'
    }
  }
}

export function initProducts() {
  loadProducts()
}
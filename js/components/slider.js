import { addProductToBasket } from './basket.js'
import { formatPrice, initTooltips } from './utils.js'

function createDayProductSlide(product) {
  const slide = document.createElement('li')
  slide.classList.add('day-products__item', 'swiper-slide')

  slide.innerHTML = `
    <div class="product-card product-card--small">
      <div class="product-card__visual">
        <img class="product-card__img" src="${product.image.replace('../', '')}" height="344" width="290" alt="${product.name}">
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

  // Вешаем обработчик добавления в корзину (раньше его тут не было!)
  const basketBtn = slide.querySelector('.btn--icon')
  basketBtn.addEventListener('click', function (event) {
    event.preventDefault()
    addProductToBasket(product)
  })

  return slide
}

function renderDayProducts(products) {
  const dayProductsList = document.querySelector('.day-products__list')
  dayProductsList.innerHTML = ''

  const dayProducts = products.filter(function (product) {
    return product.goodsOfDay === true
  })

  dayProducts.forEach(function (product) {
    const slide = createDayProductSlide(product)
    dayProductsList.append(slide)
  })

  // Активируем тултипы Tippy.js внутри слайдера
  initTooltips(dayProductsList)
}

function initSwiper() {
  new Swiper('.day-products__slider', {
    slidesPerView: 4,
    spaceBetween: 40,
    navigation: {
      nextEl: '.day-products__navigation-btn--next',
      prevEl: '.day-products__navigation-btn--prev',
    },
  })
}

export async function initSlider() {
  const dayProductsList = document.querySelector('.day-products__list')

  try {
    const response = await fetch('./data/data.json')

    if (!response.ok) {
      throw new Error('Ошибка загрузки товаров дня')
    }

    const products = await response.json()
    renderDayProducts(products)
    initSwiper()
  } catch (error) {
    console.error(error)
    if (dayProductsList) {
      dayProductsList.innerHTML = '<li style="padding: 20px;">Не удалось загрузить товары дня.</li>'
    }
  }
}

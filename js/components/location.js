export function initLocation() {
  const cityBtn = document.querySelector('.location__city')
  const cityName = document.querySelector('.location__city-name')
  const cityLinks = document.querySelectorAll('.location__sublink')

  cityBtn.addEventListener('click', function () {
    cityBtn.classList.toggle('location__city--active')
  })

  cityLinks.forEach(function (button) {
    button.addEventListener('click', function () {
      cityName.textContent = button.textContent
      cityBtn.classList.remove('location__city--active')
    })
  })
}

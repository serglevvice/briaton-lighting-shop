function createModal(message) {
  const modal = document.createElement('div')
  modal.classList.add('form-modal')

  modal.innerHTML = `
    <div class="form-modal__content">
      <button class="form-modal__close" type="button">×</button>
      <p class="form-modal__text">${message}</p>
    </div>
  `

  const closeBtn = modal.querySelector('.form-modal__close')

  closeBtn.addEventListener('click', function () {
    modal.remove()
  })

  document.body.append(modal)
}

function sendForm(form) {
  const formData = new FormData(form)

  return fetch(form.action, {
    method: form.method,
    body: formData,
  })
}

export function initForm() {
  const form = document.querySelector('.questions__form')

  const validation = new JustValidate(form)

  validation
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Введите имя',
      },
      {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Минимум 3 символа',
      },
      {
        rule: 'maxLength',
        value: 20,
        errorMessage: 'Максимум 20 символов',
      },
    ])
    .addField('#email', [
      {
        rule: 'required',
        errorMessage: 'Введите почту',
      },
      {
        rule: 'email',
        errorMessage: 'Введите корректную почту',
      },
    ])
    .addField('#agree', [
      {
        rule: 'required',
        errorMessage: 'Нужно согласиться с политикой',
      },
    ])
    .onSuccess(function (event) {
      event.preventDefault()

      sendForm(form)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Ошибка отправки формы')
          }

          createModal('Заявка успешно отправлена')
          form.reset()
        })
        .catch(function () {
          createModal('Не удалось отправить форму. Попробуйте позже')
        })
    })
}
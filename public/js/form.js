 import * as yup from 'https://cdn.skypack.dev/yup';

const form = document.getElementById('form-email');
let formError = document.getElementsByClassName('erros')[0];

const schema = yup.object().shape({
  name: yup.string().required('* O campo Nome é obrigatório').min(2, '* Nome deve ter pelo menos 2 caracteres'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: yup.string().required('* Telefone é obrigatório').matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato inválido (ex: (99) 99999-9999)'),
  date: yup.date().transform((value, originalValue) => {
    const parsedDate = new Date(originalValue);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }).typeError('Data inválida').required('* Data de nascimento é obrigatória')
  .max(new Date(), 'Data de nascimento não pode ser no futuro'),
});

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.innerHTML = '';

  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    date: form.date.value,
  };

  try {
    await schema.validate(data, { abortEarly: false });
    alert('Validação OK! Enviando...');
    form.submit(); // ou fetch/ajax
  } catch (err) {
    if (err.inner) {
      err.inner.forEach(e => {
        const p = document.createElement('p');
        p.textContent = e.message;
        formError.appendChild(p);
      });
    }
  }

});
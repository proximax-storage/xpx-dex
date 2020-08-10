export function formatQuantity (el, binding) {
  var s = JSON.stringify
  const quantity = s(binding.value.q).replace(/["]+/g, ' ').split('.')
  const coin = s(binding.value.c).replace(/["]+/g, ' ')
  const cl1 = binding.value.cl1 ? s(binding.value.cl1).replace(/["]+/g, ' ') : ''
  const cl2 = binding.value.cl1 ? s(binding.value.cl2).replace(/["]+/g, ' ') : ''
  if (quantity.length > 1) {
    el.innerHTML = `<span class="fs-085rem font-weight-medium ${cl1}">${quantity[0]}.</span><span class="fs-07rem ${cl2}">${quantity[1]}</span>
                    <span class="fs-085rem font-weight-medium ${cl1}">${coin}</span>`
  } else {
    el.innerHTML = `<span class="fs-085rem font-weight-medium ${cl1}"> ${quantity[0]}</span>
                    <span class="fs-085rem font-weight-medium ${cl1}">${coin}</span>`
  }
}

export function quantity (el, binding) {
  var s = JSON.stringify
  const quantity = s(binding.value.q).replace(/["]+/g, ' ').split('.')
  const coin = s(binding.value.c).replace(/["]+/g, ' ')
  if (quantity.length > 1) {
    el.innerHTML = `<span class="fs-085rem font-weight-medium">${quantity[0]}.</span><span class="fs-07rem">${quantity[1]}</span>
                      <span class="fs-085rem font-weight-medium">${coin}</span>`
  } else {
    el.innerHTML = `<span class="fs-085rem font-weight-medium"> ${quantity[0]}</span>
                      <span class="fs-085rem font-weight-medium">${coin}</span>`
  }
}

import { createEl, renderDom, getPatches, patch } from './vDom/index'

const vDom = createEl(
  'div',
  {
    style: {
      color: 'red'
    },
    name: 'wrapper',
    class: 'class1',
    value: 'kid'
  },
  [
    createEl('ul', {}, [
      createEl('li', {}, [1]),
      createEl('li', {}, [2]),
      createEl('li', {}, ['li3'])
    ]),
    createEl('div', {}, [
      createEl('input', { value: 'txt' }),
      createEl('textarea', { value: 123 }),
      'input wrapper'
    ]),
    'end of div'
  ]
)

const vDom2 = createEl(
  'div',
  {
    style: {
      color: 'red'
    },
    name: 'wrapper',
    class: 'class1',
    value: 'kid'
  },
  [
    createEl('ul', {}, [
      createEl('li', {}, [1]),
      createEl('li', {}, [2]),
      createEl('li', {}, ['li3'])
    ]),
    createEl('div', {}, [
      createEl('input', { value: 'txt' }),
      // createEl('textarea', { value: 123 }),
      'input wrapper'
    ]),
    'change'
  ]
)

let dom = vDom.render()

renderDom(document.getElementById('app'), dom)

console.log(getPatches(vDom, vDom2))
patch(vDom, getPatches(vDom, vDom2))

setTimeout(() => {}, 1000)

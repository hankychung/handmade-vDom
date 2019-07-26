function setAttribute(dom, k, v) {
  switch (k) {
    case 'style':
      Object.keys(v).forEach(key => {
        dom.style[key] = v[key]
      })
      break
    case 'value':
      if (dom.tagName === 'INPUT' || dom.tagName === 'TEXTAREA') {
        dom.value = v
        break
      }
    default:
      dom.setAttribute(k, v)
  }
}

class Element {
  constructor(tag, attributes, children) {
    this.tag = tag
    this.attributes = attributes
    this.children = children
  }

  render() {
    // create dom
    let dom = document.createElement(this.tag)

    // set attributes
    const attrs = this.attributes || {}
    Object.keys(attrs).forEach(k => {
      setAttribute(dom, k, attrs[k])
    })

    // create children
    const children = this.children || []
    if (children.length) {
      let childNode
      children.forEach(child => {
        // 如果child还是vDom，递归调用render方法
        if (child instanceof Element) {
          childNode = child.render()
        } else if (typeof child === 'string' || typeof child === 'number') {
          childNode = document.createTextNode(child)
        } else {
          throw '子元素只能是Element的实例对象或者TextNode'
        }
        dom.appendChild(childNode)
      })
    }

    return dom
  }
}

export function createEl(tag, attributes, children) {
  return new Element(tag, attributes, children)
}

export function renderDom(target, dom) {
  target.parentNode.replaceChild(dom, target)
}

export function getPatches(oldVDom, newVDom) {
  console.log(oldVDom, newVDom)
  let patches = {}
  walkDiffs(oldVDom, newVDom, patches, 0)
  return patches
}

function walkDiffs(oldVDom, newVDom, patches, index) {
  let diffRes,
    walkDeep = true
  // 无新节点，删除操作
  if (newVDom === undefined) {
    diffRes = {
      type: 'REMOVE'
    }
    walkDeep = false
  }
  // 存在新节点
  else {
    // 新节点与旧节点同为文本节点
    if (!newVDom.tag && !oldVDom.tag) {
      // 直接比对文本值
      if (newVDom !== oldVDom) {
        diffRes = {
          type: 'MODIFY_TXT',
          text: newVDom
        }
      }
      walkDeep = false
    }
    // 新节点与旧节点为同一类型的节点
    else if (newVDom.tag === oldVDom.tag) {
      // 对比属性值
      let diffAttrs = {}

      let newAttrs = newVDom.attributes,
        oldAttrs = oldVDom.attributes

      // 遍历旧属性，收集有修改的属性
      for (let k in oldAttrs) {
        let oldA = typeof oldAttrs[k] === 'object' ? JSON.stringify(oldAttrs[k]) : oldAttrs[k],
          newA = typeof newA[k] === 'object' ? JSON.stringify(newA[k]) : newA[k],
        
        if (oldAttrs[k] !== newAttrs[k]) {
          diffAttrs[k] = newAttrs[k]
        }
      }

      // 遍历新属性，收集新增的属性
      for (let k in newAttrs) {
        if (!k in oldAttrs) {
          diffAttrs[k] = newAttrs[k]
        }
      }

      diffRes = {
        type: 'MODIFY_ATTR',
        diffAttrs
      }
    }
    // 新节点与旧节点不是同一类型的节点，直接替换为新节点
    else {
      diffRes = {
        type: 'REPLACE',
        newNode: newVDom
      }
      walkDeep = false
    }
  }
  // 当前节点为被替换或者被移除的补丁类型时，不遍历其子节点
  if (walkDeep) {
    let childNodes = oldVDom.children,
      newChildNodes = newVDom.children ? newVDom.children : []
    childNodes &&
      childNodes.forEach((child, idx) => {
        walkDiffs(child, newChildNodes[idx], patches, ++index)
      })
  }

  if (diffRes) {
    patches[index] = diffRes
  }
}

export function patch(node, patches) {
  walkToPatch(node, patches, 0)
}

function walkToPatch(node, patches, index) {
  let patch = patches[index]
  if (patch) {
    doPatch(node, patch)
  }

  let childNodes = node.childNodes
  // 当前节点为被替换或者被移除的补丁类型时，不遍历其子节点
  if (!childNodes || patch.type === 'REMOVE' || patch.type === 'REPLACE') return
  for (let i = 0; i < childNodes.length; i++) {
    walkToPatch(childNodes[i], patches, index + 1)
    if (patches[index].type === 'REMOVE') --i
  }
}

function doPatch(node, patch) {
  switch (patch.type) {
    case 'REMOVE':
      node.parentNode.removeChild(node)
  }
}

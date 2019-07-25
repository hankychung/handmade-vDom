function setAttribute(dom, k, v) {
  switch (k) {
    case "style":
      Object.keys(v).forEach(key => {
        dom.style[key] = v[key];
      });
      break;
    case "value":
      if (dom.tagName === "INPUT" || dom.tagName === "TEXTAREA") {
        dom.value = v;
        break;
      }
    default:
      dom.setAttribute(k, v);
  }
}

class Element {
  constructor(tag, attributes, children) {
    this.tag = tag;
    this.attributes = attributes;
    this.children = children;
  }

  render() {
    // create dom
    let dom = document.createElement(this.tag);

    // set attributes
    const attrs = this.attributes || {};
    Object.keys(attrs).forEach(k => {
      setAttribute(dom, k, attrs[k]);
    });

    // create children
    const children = this.children || [];
    if (children.length) {
      let childNode;
      children.forEach(child => {
        // 如果child还是vDom，递归调用render方法
        if (child instanceof Element) {
          childNode = child.render();
        } else if (typeof child === "string" || typeof child === "number") {
          childNode = document.createTextNode(child);
        } else {
          throw "子元素只能是Element的实例对象或者TextNode";
        }
        dom.appendChild(childNode);
      });
    }

    return dom;
  }
}

export function createEl(tag, attributes, children) {
  return new Element(tag, attributes, children);
}

export function renderDom(target, vdom) {
  let dom = vdom.render();
  dom.setAttribute("id", "root");
  target.parentNode.replaceChild(dom, target);
}

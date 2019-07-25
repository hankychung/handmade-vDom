import { createEl, renderDom } from "./vDom/index";

const vDom = createEl(
  "div",
  {
    style: {
      color: "red"
    },
    name: "wrapper",
    class: "class1",
    value: "kid"
  },
  [
    createEl("ul", {}, [
      createEl("li", {}, [1]),
      createEl("li", {}, [2]),
      createEl("li", {}, ["li3"])
    ]),
    createEl("div", {}, [
      createEl("input", { value: "txt" }),
      createEl("textarea", { value: 123 }),
      "input wrapper"
    ]),
    "end of div"
  ]
);

renderDom(document.getElementById("app"), vDom);

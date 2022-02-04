/* eslint-disable react/style-prop-object */

//-----steps-1
// const element = <h1 title="foo">Hello</h1>
// const element = React.createElement(
//     "h1",
//     { title: "foo" },
//     "Hello"
//   )
// {
//     "type": "h1",

//     "props": {
//         "title": "foo",
//         "children": "Hello"
//     },
//     "_owner": null,
//     "_store": {}
// }

/***
 * const container = document.getElementById("root")
const element = {
  type: "h1",
  props: {
    title: "foo",
    children:"Hello",
  }
} 

const node:HTMLElement = document.createElement(element.type)
node["title"] = element.props.title
const text:Text = document.createTextNode("")
console.log(text)
text["nodeValue"] = element.props.children
node.appendChild(text)
container?.appendChild(node)
 * 
 * 
 */

type CustomJSX = Pick<JSX.Element, "type" | "props">; // Omit<JSX.Element,"key">
//   ReactDOM.render(element, container)
function createTextElement(text: string): CustomJSX {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}
// Partial<JSX.Element>
type PropsType = Record<string, string>;
const createElement = (
  type: string,
  props: PropsType,
  ...children: JSX.Element[]
): CustomJSX => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === "object") {
          return child;
        } else return createTextElement(child);
      })
    }
  };
};
function render(element: JSX.Element, container: HTMLElement) {
  const dom: HTMLElement =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  const isProperty = (key: string) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });
  element.props.children.forEach(
    (child: JSX.Element): ReturnType<typeof render> => render(child, dom)
  );
  container.appendChild(dom);
}
export const QReact = {
  createElement,
  render
};
// const element = QReact.createElement(
//     "div",
//     { id: "foo" },
//     QReact.createElement("a", null, "bar"),
//     QReact.createElement("b")
//   )

/** @jsxRuntime classic */
/** @jsx QReact.createElement */
const element: JSX.Element = (
  <div id="foo" style={"background: salmon"}>
    <a>foobar</a>
    <q>
      <h4>hello h4</h4>
    </q>
    <b />
    <h1>Hello world</h1>
  </div>
);
// const element = (
//     <div id="foo">
//       <a href=''>bar</a>
//       <b />
//     </div>
//   )

const container = document.getElementById("root");
//   ReactDOM.render(element, container)
QReact.render(element, container as HTMLElement);

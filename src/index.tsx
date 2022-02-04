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

/**
 * this will divert jsx parsing through our custom createElement
 * function.by default jSX runtime is automatic,we have to use old
 * classic runtimes
 */
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

const container = document.getElementById("root");

QReact.render(element, container as HTMLElement);

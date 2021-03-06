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

let nextUnitOfWork = null;
function render(element: JSX.Element, container: HTMLElement) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  };
}
export const QReact = {
  createElement,
  render
};
/***
 * step-3 concurrent mode activation to free main thread for browser
 * work and animations
 */

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

type Fiber = {
  parent: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  dom: HTMLElement | null;
} & Pick<JSX.Element, "type" | "props">;
function createDom(fiber: Fiber): HTMLElement {
  const dom: HTMLElement =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
}
function performUnitOfWork(fiber: Fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom?.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;
  while (index < elements.length) {
    const element = elements[index];

    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling!.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }

  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

/**
 * this will divert jsx parsing through our custom createElement
 * function.by default jSX runtime is automatic,we have to use old
 * classic runtimes
 */
/** @jsxRuntime classic */
/** @jsx QReact.createElement */
const element: JSX.Element = (
  <div id="foo">
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

// const element = <h1 title="foo">Hello</h1>
// const container = document.getElementById("root")
// ReactDOM.render(element, container)
// abouve 3 line of code is equivalent to below code -jsX runtime
// parse through jsx and convert it to  React.createElement code
// const element = {
//   type: "h1",
//   props: {
//     title: "foo",
//     children: "Hello",
//   },
// }
// ​
// const container = document.getElementById("root")
// ​
// const node = document.createElement(element.type)
// node["title"] = element.props.title
// ​
// const text = document.createTextNode("")
// text["nodeValue"] = element.props.children
// ​
// node.appendChild(text)
// container.appendChild(node)

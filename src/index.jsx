import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./reducers";
import { Provider } from "react-redux";

const root = createRoot(document.getElementById("root"));

root.render(
  // 这个Suspense用于处理异步加载，当其子组件还在加载时，它会显示fallback属性指定的内容。在这个例子中，当应用还在加载时，会显示一个包含“Loading”的<h1>标签。
  <Suspense
    fallback={
      <div id="sus-fallback">
        <h1>Loading</h1>
      </div>
    }
  >
    {/* <Provider>组件用于将Redux store传递给所有的子组件 */}
    <Provider store={store}>
      <App />
    </Provider>
  </Suspense>,
);

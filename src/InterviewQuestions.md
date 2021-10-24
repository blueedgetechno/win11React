# 1) What is React?

React is a declarative, efficient, flexible open source front-end JavaScript library developed by Facebook in 2011. It follows the component-based approach for building reusable UI components, especially for single page application. It is used for developing interactive view layer of web and mobile apps. It was created by Jordan Walke, a software engineer at Facebook. It was initially deployed on Facebook's News Feed section in 2011 and later used in its products like WhatsApp & Instagram.



# 2) What are the features of React?

React framework gaining quick popularity as the best framework among web developers. The main features of React are:



JSX
Components
One-way Data Binding
Virtual DOM
Simplicity
Performance


# 3) What are the most crucial advantages of using React?
Following is a list of the most crucial advantages of using React:

React is easy to learn and use

React comes with good availability of documentation, tutorials, and training resources. It is easy for any developer to switch from JavaScript background to React and easily understand and start creating web apps using React. Anyone with little knowledge of JavaScript can start building web applications using React.

React follows the MVC architecture.

React is the V (view part) in the MVC (Model-View-Controller) architecture model and is referred to as "one of the JavaScript frameworks." It is not fully featured but has many advantages of the open-source JavaScript User Interface (UI) library, which helps execute the task in a better manner.

React uses Virtual DOM to improve efficiency.

React uses virtual DOM to render the view. The virtual DOM is a virtual representation of the real DOM. Each time the data changes in a react app, a new virtual DOM gets created. Creating a virtual DOM is much faster than rendering the UI inside the browser. Therefore, with the use of virtual DOM, the efficiency of the app improves. That's why React provides great efficiency.


Creating dynamic web applications is easy.

In React, creating a dynamic web application is much easier. It requires less coding and gives more functionality. It uses JSX (JavaScript Extension), which is a particular syntax letting HTML quotes and HTML tag syntax to render particular subcomponents.

React is SEO-friendly.

React facilitates a developer to develop an engaging user interface that can be easily navigated in various search engines. It also allows server-side rendering, which is also helpful to boost the SEO of your app.

React allows reusable components.


React web applications are made up of multiple components where each component has its logic and controls. These components provide a small, reusable piece of HTML code as an output that can be reused wherever you need them. The code reusability helps developers to make their apps easier to develop and maintain. It also makes the nesting of the components easy and allows developers to build complex applications of simple building blocks. The reuse of components also increases the pace of development.

Support of handy tools

React provides a lot of handy tools that can make the task of the developers understandable and easier. Use these tools in Chrome and Firefox dev extension, allowing us to inspect the React component hierarchies in the virtual DOM. It also allows us to select the particular components and examine and edit their current props and state.


React has a rich set of libraries.

React has a huge ecosystem of libraries and provides you the freedom to choose the tools, libraries, and architecture for developing the best application based on your requirement.

Scope for testing the codes

React web applications are easy to test. These applications provide a scope where the developer can test and debug their codes with the help of native tools.


# 4) What are the biggest limitations of React?
Following is the list of the biggest limitations of React:

React is just a library. It is not a complete framework.
It has a huge library which takes time to understand.
It may be difficult for the new programmers to understand and code.
React uses inline templating and JSX, which may be difficult and act as a barrier. It also makes the coding complex.

# 5) What is JSX?
JSX stands for JavaScript XML. It is a React extension which allows writing JavaScript code that looks similar to HTML. It makes HTML file easy to understand. The JSX file makes the React application robust and boosts its performance. JSX provides you to write XML-like syntax in the same file where you write JavaScript code, and then preprocessor (i.e., transpilers like Babel) transform these expressions into actual JavaScript code. Just like XML/HTML, JSX tags have a tag name, attributes, and children.

Example

class App extends React.Component {  
  render() {  
    return(  
      <div>  
        <h1>Hello JavaTpoint</h1>  
      </div>  
    )  
  }  
}  
In the above example, text inside <h1> tag return as JavaScript function to the render function. After compilation, the JSX expression becomes a normal JavaScript function, as shown below.



# 6) Why can't browsers read JSX?

Browsers cannot read JSX directly because they can only understand JavaScript objects, and JSX is not a regular JavaScript object. Thus, we need to transform the JSX file into a JavaScript object using transpilers like Babel and then pass it to the browser.

# 7) Why we use JSX?


It is faster than regular JavaScript because it performs optimization while translating the code to JavaScript.
Instead of separating technologies by putting markup and logic in separate files, React uses components that contain both.
t is type-safe, and most of the errors can be found at compilation time.
It makes easier to create templates.


# 8) What do you understand by Virtual DOM?


A Virtual DOM is a lightweight JavaScript object which is an in-memory representation of real DOM. It is an intermediary step between the render function being called and the displaying of elements on the screen. It is similar to a node tree which lists the elements, their attributes, and content as objects and their properties. The render function creates a node tree of the React components and then updates this node tree in response to the mutations in the data model caused by various actions done by the user or by the system.

# 9) Explain the working of Virtual DOM.
Virtual DOM works in three steps:

1. Whenever any data changes in the React App, the entire UI is re-rendered in Virtual DOM representation.

React Interview Questions1
2. Now, the difference between the previous DOM representation and the new DOM is calculated.

React Interview Questions2
3. Once the calculations are completed, the real DOM updated with only those things which are changed.


# 10) How is React different from Angular?
The React is different from Angular in the following ways.

                      Angular	                         React
Author	              Google	                    Facebook Community
Developer	        Misko Hevery	                Jordan Walke
Initial Release	    October 2010	                March 2013
Language	       JavaScript, HTML	                JSX
Type	        Open Source MVC Framework	        Open Source JS Framework
Rendering	           Client-Side	                Server-Side
Data-Binding	     Bi-directional	                Uni-directional
DOM	                   Regular DOM	                Virtual DOM
Testing	        Unit and Integration Testing	    Unit Testing
App                    Architecture	                MVC	Flux
Performance	             Slow	                    Fast, due to virtual DOM.

# Home Automation App

A simple React JS Application coupled with a rest service that lets users control devices in a virtual home. 

We are using Spring Boot as the web server.
 
We use [Bootstrap CSS] along with [fetch] to complement React in the creation of our user interface with the following key features:
  - reusable components for all controls (light switch/curtains/temperature slider)
  - debounced callback (500 ms) to slider events
  - event handlers that guarantee the correct flow of data
  - asynchronous state updates via React's `setState`
  - React Router included in app (currently there's just one page)
  
 
You can start the app by typing in the root directory:

``mvn spring-boot: run``

then navigate to the web application at
 
``localhost:8080``


[Bootstrap CSS]: <http://getbootstrap.com/css/>
[fetch]: <https://github.com/github/fetch>

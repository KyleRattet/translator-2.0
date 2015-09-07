Public

-- main.js

- add logic that stops the quiz at 20, then displays complete result and adds these test results to graph (how is ben using the data?)

- check how data is stored if no user has signed in, is it possible to then access to these variables if someone wants to create a new user after they have already done soe practice tests? and can this info be sent via an ajax request so that a new user can have the tests theyva already don saved?

- what to do if test not completed, so neither failed nor finished e.g. 14/20 questions done with only 3 wrong...


Server

-- routes/index.js

- create a route to add a user into the database, again this will depend on what information is being use by ben to display the data

- create a route to grab this information back and then use it to populate the page. (create a user form and button at the top of the page?)

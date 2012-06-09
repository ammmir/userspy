# Building a Node.js App Using Express & Socket.IO

Here are some notes for my node.js workshop that you can use to follow along during and after the talk. Together, we'll build the server-side portion of a simple app called UserSpy using two popular node.js frameworks: [express](http://expressjs.com/) and [socket.io](http://socket.io/).

## Prerequisites

### 1. Install Node.js

The very first thing you'll want to do is install [node.js](http://nodejs.org/) on your local machine. Click the Download button on the website and choose the correct package for your platform.

### 2. Verify Installation 

Ensure installation was successful by running `node -v` in a terminal. It should print out the version of node installed.

### 3. Install Nodemon

When developing node apps, you'll need to restart the app after every change. To automate this, install [nodemon](https://github.com/remy/nodemon):

    sudo npm install nodemon -g

From now on, instead of running apps using node you can use nodemon to get the auto-restart functionality.

## Grab the Project

### 1. Make a Clone of the [Userspy Repository](https://github.com/ammmir/userspy):

    git clone https://github.com/ammmir/userspy
    cd userspy

### 2. Install Dependencies:

    npm install

Although node has a rich core API, there are thousands of modules available at the official [npm registry](http://search.npmjs.org/). A node app declares its module dependencies in a file called [package.json](https://github.com/ammmir/userspy/blob/master/package.json).

### 3. Finally, Run the App:

    nodemon server.js

## Start Coding

If you followed all the steps above, you'll see something like this:

    5 Jun 15:11:57 - [nodemon] v0.6.12
    5 Jun 15:11:57 - [nodemon] watching: /Users/amir/src/userspy
    5 Jun 15:11:57 - [nodemon] starting `node server.js`
    UserSpy server started.

Now we're ready to start coding :)
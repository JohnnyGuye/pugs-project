# pugs-project
This project is about creating a tool to help brainstorming session to be what it is supposed to be : a tool to share ideas.

# How to set up Angular

First you'll need to install node.js on this website https://nodejs.org/en/ (that's the easy part, take the "Recommended for most users" version)
Node js is required for two things :
- it comes with "npm" a package manager that keep things easy for each library download (as simple as "npm install <name of the libraby>"
- it allows you to run a local server for testing the web interface with live reload (you change a line of code, the UI change aswell at the same time)

Once you are done with it, open a terminal (cmd on windows) and write or copy the following :

    npm install -g @angular/cli

It should install globaly angular cli meaning you can now use the set of commands beginning by "ng".
It's quickly updated so we will probably need some upgrades in the next two months.
Angular is now installed in your computer.

# How to clone the repository

Use your terminal and go to the directory in which you want to download this and work.
Use the following commands :

    git clone https://github.com/JohnnyGuye/pugs-project.git
    npm install

The first one clones the depo in your computer, the second one updates or downloads all libraries used for the website.

# How to see the interface

Use your terminal and go to the directory "prototype"
Use the command :

    ng serve --open

It should open a new tab in your browser. I recommand using Chrome, Firefox or Opera since Safari is the ugly duckling of the team.
To edit the code, use whatever text editor, IDE you prefer. I personnaly use Atom, but it's up to you.
With atom installed, when you are in the prototype folder, you can just write :

    atom .

And atom opens all the prototype for you.

> Never hesitate to ask, we are all here to learn, I might not learn much about the technical part but I have so much to learn for the other aspects ! - Johnny

# External resources :

How to Chart : http://www.chartjs.org/docs/latest/

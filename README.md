### Installation:

Installation made in development instance hosted in AWS (Ubuntu 18.04)

**1.- Download and install the nodejs development environment**

*curl -sL https://deb.nodesource.com/setup_12.x | bash -*

*apt install nodejs* 

**2.- Download the project:**

*cd /usr/local/src*
 
*git clone -b development git@github.com:proximax-storage/xpx-dex.git*

*cd /usr/local/src/xpx-dex*

*execute: npm i ; npm run-script build*

this generates a folder called dist in this directory, which must be moved to /usr/local/src/

*mv /usr/local/src/xpx-dex/dist /usr/local/src/

**3.- To raise the backend:**
*cd /usr/local/src*
*./server.run -dist dist -port 80 &*

**4.- To lift the Frontend:**

*cd /usr/local/src/xpx-dex/bridgedb/*
*npm install forever* 
*forever start main.js &*

Run forever list to check the service status and review the logs.
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

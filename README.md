# Features
- Offline capability (must visit page at least 1 time to work)
- Realtime
- CRUD todo (if offline action will be sync when the app go back)
- Progressive Web App
- Responsive design

# Technologies
- React.js
- React router
- Redux
  - Redux thunk
  - Redux persistence
- Reselect
- Immutability.js
- Firebase
- Bootstrap
- Styled-components
- Pug

# E2E Testing tool
- Mocha
- Pupeteer

# Setup
- edit config.js in `src/firebase`

# Commands
- npm install: install all needed dependency
- npm start: hmr develop at localhost:3000
- npm build: build application
- npm e2e: run all e2e tests
- npm test: run unit tests

# Offline capability
Since firebase JavaScript SDK doesn't support persistence. I have to write queues to store added, deleted, updated todo in offline mode. So when the app is back, i manually synchorinize data in queue to server. I used to redux to cache lastest todo data and queues.
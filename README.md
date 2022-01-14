### Ngx-Admin Angular 8 application from akveo.com

This is modified and more lightweight version of original application to practice UI Automation with Cypress.

The original repo is here: https://github.com/akveo/ngx-admin


poczatek instalacji `npm install` potem zatwierdzic `y` 
deploy to local host `npm start` 
install cypress `npm install cypress --save-dev`
open cypress `npx cypress open`


cypress/support/index.js - bedzie wykonane automatycznie przed testami

nazewnictwo testow `nazwa.spec.js`

cypress uzywa silnika jquery 

aktualizacja npm `sudo npm i -g npm`

odpalenie testow w CLI `npx cypress run`

odpalenie testow na przegladarce `npx cypress run --browser chrome`

uruchomienie konkretnego testu `npx cypress run --spec "pathToTest"`

jak nie chcemy nagrywania video >> cypress.json

`"video": false`

odpalenie aplikacji i testow jedna komenda >> package.json

"scripts":  {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build --prod  --base-href ./ && cp CNAME dist/CNAME",
    "test": "ng test",
    "lint": "ng lint --force",
    "e2e": "ng e2e"
  }
  
  `npm run start` oznacza uzyj  "start": "ng serve" z ciala klucza scripts
  mozemy napisac rowniez `ng serve` czyli odwolanie jest po kluczu i value
  
  aby odpalac jedna komenda run server i puszczenei testow trzeba uzyc biblioteki zewnetrznej
  
  npm install --save-dev start-server-and-test
  
 "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build --prod  --base-href ./ && cp CNAME dist/CNAME",
    "test": "ng test",
    "lint": "ng lint --force",
    "e2e": "ng e2e",
    "cypress:run": "npx cypress run",
    "cypress:e2e": "start-test start http-get://localhost:4200 cypress:run"
  }
  
  npm run cypress:e2e
  
  Cypress Plugin Retries when test faild

cypress.json

 "retries": {
    // Configure retry attempts for `cypress run`
    // Default is 0
    "runMode": 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    "openMode": 0
  }
  
zmienne globalne mozemy wrzucic do cypress.json

"env": {
    "username": "xxx@gmail.com",
    "password": "xxx"
  }
  
  i odwolywac sie do nich przez `Cypress.env('username')`
  
  Tworzenie zmiennych srodowiskowych dla roznych srodowisk:
  
  https://docs.cypress.io/api/plugins/configuration-api#Switch-between-multiple-configuration-files
  
  REPORTS:
  
  https://docs.cypress.io/guides/tooling/reporters
  
  
  cypress.json by default) or via the command line.

Config file
{
  "reporter": "cypress-multi-reporters",
  "reporterOptions": {
    "configFile": "reporter-config.json"
  }
}

trzeba utworzyc file:

reporter-config.json a w nim wstawic:

{
  "reporterEnabled": "mocha-junit-reporter",
  "mochaJunitReporterReporterOptions": {
    "mochaFile": "cypress/results/junit/results-[hash].xml"
  }
}

w pliku cypress.json dodać

"delete:reports": "rm -r cypress/results/* || true"

doinstalować:

npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator junit-merge

w reporter-config.json

{
    "reporterEnabled": "mocha-junit-reporter, mochawesome",
    "mochaJunitReporterReporterOptions": {
      "mochaFile": "cypress/results/junit/results-[hash].xml"
    },
    "reporterOptions": {
        "reportDir": "cypress/results/mochawesome",
        "overwrite": false,
        "html": false,
        "json": true
      }
  }
  
  
  zmiana row w pascege.json na :
  
     "cypress:e2e": "start-test start http-get://localhost:4200 cypress:run; npm run junit:merge; npm run mochawesome:merge",
    "mochawesome:merge": "npx mochawesome-merge \"cypress/results/mochawesome/*.json\" > mochawesome.json && npx marge mochawesome.json",
    "junit:merege": "npx junit-merge -d cypress/results/junit -o cypress/junit/results.xml"
  

  "delete:reports": "rm -r cypress/results/* || true",
    "prereport": "npm run delete:reports",
    "mochawesome:merge": "npx mochawesome-merge \"cypress/results/mochawesome/*.json\" > mochawesome.json && npx marge mochawesome.json",
    "junit:merge": "npx junit-merge -d cypress/results/junit -o cypress/junit/results.xml",
    "cypress:run": "npm run prereport && npx cypress run",
    "cypress:e2e": "start-test start http-get://localhost:4200 cypress:run; npm run junit:merge; npm run mochawesome:merge"
  },
  
 
 DOCKER
 
 https://docs.cypress.io/examples/examples/docker
 
 utworzyc DockerFile
 
 FROM cypress/base:10.18.0

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --save-dev cypress

RUN $(npm bin)/cypress verify

RUN $(npm bin)/cypress run

RUN ["npm", "run", "cypress:run"]

utworzyc .dockerignore i dodać niepotrzebne do kopiowania foldery jak np node_modules

`docker build -t cypress .`


 dodac docker-compose.yml aby miec dostep do wynikow poniewaz wszytsko sie tworzy w docker container
 
 version: '3.7'
 services:
  e2e:
    image: cypress_compose
    build:
      context: .
      dockerfile: ./Dockerfile
    volumes:
      - ./dockerReports:/app/cypress/results
      - ./dockerReports:/app/mochawesome-report
      
 
 OKTA LOGIN
 
 https://gist.github.com/ndavis/2c84ab40aaa3c98c3a8062bdb3938232
 
 odpalanie cross browsers:
 
     "cy:run_browser": "npx cypress run --browser firefox --headless & npx cypress run --browser chrome --headless"

Dashboard

Trzeba sie zalogowac w oknie npx cypress open  do uruchomienia trzeba dodac klucz aby wszytsko bylo wysylane do dashboard
https://www.cypress.io/dashboard/

grupowanie wynikow na np przegladarki poprzez flage `--group nazwa_grupy` to jest rowniez puszczanie in parallel na jednej maszynie ale zeby puszczac na roznych trzeba uzyc flagi --parallel

 
 
  PRZYKŁADY CYPRESS https://github.com/cypress-io/cypress-example-recipes
  
  live chat cypress gitter.im/cypress-io-cypress
  
 
  

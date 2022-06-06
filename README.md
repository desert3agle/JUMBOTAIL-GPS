# Jumbotail - GPS Asset Tracking Application

## Table of contents
- [Overview](#overview)
- [Features](#features)
- [Links](#links)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Developers](#developers)
- [Screenshots](#screenshots)

## Overview
GPS based asset tracking dashboard to track all the company’s assets.
dashboard showing the assets (can be delivery trucks or salespersons) on a map so the assets can be easily tracked, with the option to drill down further into the details of a specific asset.
#### Use case for GPS tracking at Jumbotail
[Jumbotail](https://jumbotail.com/) is aimed at creating an online wholesale marketplace for food and grocery, allowing buyers and sellers to transact on the platform. Some use cases that the company caters to, like delivery, sales personnel marketing, require a need to implement a GPS based tracking system to track movements to optimize the supply chain.

Being able to track movement of delivery persons and fleet on a map has become a necessity to optimize the supply chain by improving delivery times.
## Features
1. Authentication (login/signup)
2. Map on which markers show the latest locations of all assets. ( by default 100 markers )
3. Support search/filter options based on asset id or asset type.
4. Support for time based filters which will take start date/time and end date/time as inputs.
5. Upon clicking over a marker, it gives a popup showing asset details like asset type, asset id, timestamp and option for different views.
6. Timeline based view of the asset, which shows markers for each location of the asset for the past 24 hours ( default )
7.  Geofencing - a feature to allow selection of an area on a map that a particular asset has to be restricted to. Any movement of this asset outside of the selected area results in a notification on the application’s UI.
8.  Anomaly Detection - allows a user to select a predefined route and set it as expected route for a particular asset. Any deviation from this route triggers a notification.
9. Responsive UI, can be used across different divices.
10. Notifcations on asset movements. 

## Links
* API documentation [here](https://documenter.getpostman.com/view/10910666/Uz5Govwb)
* Deployed [here](https://jumbotail-gps.herokuapp.com/)
* Demo video [here](https://drive.google.com/file/d/14JOisLK-bkjgnAyZmUeGAoFjLlOcIkyT/view?usp=sharing)
## Tech Stack
### Frontend
 * [React](https://reactjs.org/) - Front-end JavaScript library
 * [Mapbox](https://www.mapbox.com/)  - For Map Api 
 * [deck.gl](https://deck.gl/) - Visualization framework built on Mapbox 
 * [react-map-gl](https://visgl.github.io/react-map-gl/) - React wrapper for Mapbox GL   
 * [nebula.gl](https://nebula.gl/) - A suite of 3D-enabled data editing overlays, suitable for deck.gl.
 * [material-ui](https://mui.com/) - UI tools for React
### Backend

 * [Node.js](https://nodejs.org/en/)  -  Evented  I/O  for  backend
 * [Express](https://expressjs.com/)  -  Fast  Node.js  network  app  framework
 * [Socket  IO](https://socket.io/) -  JavaScript  library  for  realtime  web  applications
 * [MongoDB](https://www.mongodb.com/)  -  General  purpose,  document  based  NoSQL  Database

### Tools
 * [Postman](https://www.postman.com/)  -  For api testing and documentation

## Getting started
### Local build
#### Frontend
It requires [React](https://reactjs.org/) to run.

Install the dependencies
```sh
cd client/
yarn install
```
Setup environments variables. (fill in .env template)
```sh
mv .env.template .env
```
Start the server
```sh
yarn start
```
#### Backend
It requires [Node.js](https://nodejs.org/) v14+ and [MongoDB](https://www.mongodb.com) v4+ to run.

Install the dependencies and devDependencies.
```sh
cd server/
npm install
```
Setup environments variables. (fill in .env template)
```sh
mv src/config/config.env.template src/config/config.env
```
Start the server
```sh
npm run start
```
**Testing**  <br>
Make sure you have mochajs installed globally, Setup environments variables. 
```sh
npm run test
```
## Deployment


### Heroku Deployment
```sh
heroku login -i
heroku git:remote -a <your-app-name>
git push heroku master
```
Set up environment variables 
```sh
heroku config:set ENV_VAR=<value>
```

## Developers
* **Harsh Vardhan** - *Initial work* - [desert3agle](https://github.com/desert3agle)
* **Mohit Jaiswal** - *Initial work* - [kelvin0179](https://github.com/kelvin0179)
## Screenshots
- Authentication login/signup <br>
<a href="https://imgur.com/ntJ9vNa"><img src="https://i.imgur.com/ntJ9vNa.png" title="source: imgur.com" /></a><br>
- Various filter by asset type , date range or ID <br>
<a href="https://imgur.com/zn1IFlN"><img src="https://i.imgur.com/zn1IFlN.png" title="source: imgur.com" /></a><br>
- Track past 24 hr activites <br>
<a href="https://imgur.com/nQUnRcz"><img src="https://i.imgur.com/nQUnRcz.png" title="source: imgur.com" /></a><br>
- Geofence and anamoly detection <br>
<a href="https://imgur.com/YXOOIs2"><img src="https://i.imgur.com/YXOOIs2.png" title="source: imgur.com" /></a><br>
- Georoute and anamoly detection <br>
<a href="https://imgur.com/ul7pUFv"><img src="https://i.imgur.com/ul7pUFv.png" title="source: imgur.com" /></a><br>
- Real time  asset update and anomaly detection <br>
<a href="https://imgur.com/2XDWB1I"><img src="https://i.imgur.com/2XDWB1I.gif" title="source: imgur.com" /></a><br>
- Responsive for phone <br>
<a href="https://imgur.com/unF7hei"><img src="https://i.imgur.com/unF7hei.png" title="source: imgur.com"  
width="350px" height="600px"
/></a>

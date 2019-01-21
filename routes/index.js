var express = require('express');
var router = express.Router();
var dbDriver = require('./../class/Driver');
var dbUser = require('./../class/User');
var dbRace = require('./../class/Race');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/save-new-driver', function(req, res, next){
    res.setHeader('Content-Type', 'application/json');

    dbDriver.saveDriver(req.body).then(results => {
      res.send(results);
    }).catch(error => {
      res.send(error);
    });
    
});

router.post('/search-driver', function(req, res, next){
  res.setHeader('Content-Type', 'application/json');

  dbDriver.searchDriver(req.body.name).then(results => {
    res.send(results);
  }).catch(error => {
    res.send(error);
  });
  
});

router.post('/change-status', function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  console.log('1', req.body);
  dbDriver.changeStatus(req.body).then(results => {
    console.log('2', results);
    res.send(results);
  }).catch(error => {
    res.send(error);
  });
  
});

router.post('/save-new-user', function(req, res, next){
  res.setHeader('Content-Type', 'application/json');

  dbUser.saveUser(req.body).then(results => {
    res.send(results);
  }).catch(error => {
    res.send(error);
  });
  
});

router.post('/search-user', function(req, res, next){
res.setHeader('Content-Type', 'application/json');

dbUser.searchUser(req.body.name).then(results => {
  res.send(results);
}).catch(error => {
  res.send(error);
});

});

router.post('/save-new-race', function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  console.log(req.body);
  dbRace.saveRace(req.body).then(results => {
    res.send(results);
  }).catch(error => {
    res.send(error);
  });
  
});

router.post('/search-races', function(req, res, next){
  res.setHeader('Content-Type', 'application/json');
  
  dbRace.searchRace(req.body).then(results => {
    res.send(results);
  }).catch(error => {
    res.send(error);
  });
  
  });


module.exports = router;

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres:Milkyway6933@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(err, res){
        if (err) console.log(err);
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(err, res){
      if (err) console.log(err);
      console.log("Vehicle Table Init")
  });

  app.get('/api/users', function(req, res, next){
    db.read.users([], function(err, users){
        if (err){
          console.error(err);
          return res.send(err);
        }
        return res.send(users);
      })
    });

    app.get('/api/vehicles', function(req, res, next){
      db.read.vehicles([], function(err, users){
          if (err){
            console.error(err);
            return res.send(err);
          }
          return res.send(users);
        })
      });

      app.get('/api/user/:userid/vehiclecount', function(req, res, next){
         db.read.userVehicleCount([req.params.userid],
         function(err, vehicles){
           if (err){
             console.error(err);
             return res.send(err);
           }

           return res.send(vehicles);
      })
       })

       app.get('/api/user/:userid/vehicle', function(req, res){
          db.read.userVehicles([req.params.userid],
          function(err, vehicles){
            if (err)
              console.error(err);
            return res.send(vehicles);
       })
        })

        app.get('/api/vehicle', (req, res, next) => {

      	if (req.query.UserEmail) {
      		let email = req.query.UserEmail;
      		db.read.vehicleByEmail([email],(err, vehicles) =>{
      			if (err) console.log(err);
      			res.json(vehicles);
      		})
      	} else if (req.query.userFirstStart) {
      		let search = req.query.userFirstStart;
      		db.read.vehiclesByUserSearch([search+'%'], (err, vehicles) => {
      			if (err) console.log(err);
      			res.json(vehicles)
      		})
      	}

      });

app.get('/api/newervehiclesbyyear', (req, res, next) => {
  db.read.newVehiclesByYear([], (err, newVehicles) => {
            if (err) console.log(err);
            else res.json(newVehicles);
  })
});

app.post('/api/users', (req, res, next) => {
  let user = req.body;
  db.create.user([user.firstname, user.lastname, user.email], (err, dbRes) =>{
    if (err) console.log(err);
    else {
          res.sendStatus(200);
    }
  })
});

app.post('/api/vehicles', (req, res, next) => {

	let vehicle = req.body;
	db.create.vehicle([vehicle.make, vehicle.model, vehicle.year, vehicle.ownerid], (err, dbRes) => {
		if (err) console.log(err);
		else res.sendStatus(200);
	})
});

app.put('/api/vehicle/:vehicleid/user/:userid', (req, res, next) => {

 let user = req.params.userid;
 let vehicle = req.params.vehicleid
 db.update.vehicleOwner([user, vehicle], (err, dbRes) => {
   if (err) console.log(err);
   else res.sendStatus(200);
 })

});

app.delete('/api/user/:userid/vehicle/:vehicleid', (req, res, next)=>{

	db.delete.vehicleOwner([req.params.vehicleid], (err) => {
		if (err) console.log(err);
		else res.sendStatus(200);
	})
});
app.delete('/api/vehicle/:vehicleid', (req, res, next)=>{

	db.delete.vehicle([req.params.vehicleid], (err) => {
		if (err) console.log(err);
		else res.sendStatus(200);
	})
});
});


app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
})

module.exports = app;

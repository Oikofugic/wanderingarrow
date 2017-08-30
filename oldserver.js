// server.js
// where your node app starts

// init project
var express = require('express');
var es6Renderer = require('express-es6-template-engine');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var s3 = new AWS.S3({
  signatureVersion: 'v4'
});
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
var bucketName = process.env.S3BUCKET;
var multer = require("multer");
var memoryStorage = multer.memoryStorage();
var memoryUpload = multer({
	storage: memoryStorage,
	limits: {
		filesize: 20*1024*1024,
		files: 1
	}
}).single("file");

//var http = require('http');
/*
var GoogleSpreadsheets = require("google-spreadsheets");
var data = {};
var title;
var list = [];
*/

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Use Body Parser to process requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Express ES6 Template Engine Settings: https://www.npmjs.com/package/express-es6-template-engine
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');

// Database:
//1AE0SArt-eBt38KZ4ztqlpid_XgyPKtAp8PG7jI_kKWs
/*
GoogleSpreadsheets({
    key: "1AE0SArt-eBt38KZ4ztqlpid_XgyPKtAp8PG7jI_kKWs"
}, function(err, spreadsheet) {
    // 0 - Bio
    spreadsheet.worksheets[0].cells({
        // grab all the data
        range: "R1C1:R2C2"
    }, function(err, result) {
    	// Put in-memory store for now
      data.bio = result.cells;
    });
  
    // 1 - CV
    spreadsheet.worksheets[1].cells({
        // grab all the data
        range: "R1C1:R100C26"
    }, function(err, result) {
    	// Put in-memory store for now
      data.cv = result.cells;
    });
});
*/




var db;
db = mongoose.connect(process.env.MONGODB_URI);


// Home page
app.get("/", function (request, response) {
  response.render('index', {
    locals: {
      title:  ''
    },
    partials: {
      template: 'views/home.html'
    }
  });
});


// Bio page
app.get("/bio", function (request, response) {
    var bioText = "";
    if  (data.bio["1"]["1"]) {
      bioText = data.bio["1"]["1"].value;
    }
    var bioImage = "";
        if  (data.bio["2"]["1"]) {
      bioImage = data.bio["2"]["1"].value;
    }
    response.render('index', {
    locals: {
      title: ': Bio',
      image: bioImage,
      text: bioText
    },
    partials: {
      template: 'views/bio.html'
    }
  });
});

// CV page

app.get("/cv", function (request, response) {
    //console.log(data);
    var cvData = {};
    title = data.cv["1"]["1"].value;
    //var test = data["1"]["2"].value;
  
    for (var i = 3; i < Object.keys(data).length; i++){
      //list.push(data[i]["1"].value);
      var section = data[i]["1"].value;
      if (!cvData[section]) {
        cvData[section] = [];
      }
      
      var sectionData = [];
      
      // Header
      if (data.cv[i]["2"]){sectionData[0] = data.cv[i]["2"].value;}
      // Subheader
      if (data.cv[i]["3"]){sectionData[1] = data.cv[i]["3"].value;}
      // Description
      if (data.cv[i]["4"]){sectionData[2] = data.cv[i]["4"].value;}
      
      cvData[section].push(sectionData);
    }
  
  
    response.render('index', {
    locals: {
      title: ': ' + title,
      data: cvData
    },
    partials: {
      template: 'views/cv.html'
    }
  });
});

// Installations page
app.get("/installations", function (request, response) {
    response.render('index', {
    locals: {
      title: ': Installations'
    },
    partials: {
      template: 'views/installations.html'
    }
  });
});

// Music

// Photography page
app.get("/photography", function (request, response) {
    response.render('index', {
    locals: {
      title: ': Photography'
    },
    partials: {
      template: 'views/photography.html'
    }
  });
});

// The Illuminator

// Video


// Web page
app.get("/web", function (request, response) {
    response.render('index', {
    locals: {
      title: ': Web'
    },
    partials: {
      template: 'views/web.html'
    }
  });
});

// Writing



// Upload Test:
app.get("/upload", function(request, response) {
  response.render("index", {
    locals: {
      title: ": Upload"
    },
    partials: {
      template: "views/upload.html"
   }
  });
});

app.post("/upload", memoryUpload, function(request, response) {
  var error = false;
  var errorMessage = "";
  if (request.body.password == process.env.PASSWORD) {
    var file = request.file;
    var filetype = file.mimetype;
    var filename = file.originalname;
    var date = new Date;
    var timestamp = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + 
                    "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "-";
    
    var params = {
      Bucket: bucketName,
      // '1502393981032'
      Key: timestamp + filename,
      Body: file.buffer,
      ContentType: filetype
    };

    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err)
        error = true;
        errorMessage = err;
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
        console.log("Data:");
        for (var d in data) {
          console.log(d + ": " + data[d]);
        }
        response.status(200);
        response.send("<img src='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
                      "'><a href='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
                      "'>https://wanderingarrows.s3.amazonaws.com/" + params.Key + "</a>");
      }

    });
    
  } else {
    error = true;
    errorMessage = "Error: wrong password.";
  }
  if (error){
    response.status(400);
    response.send("Error: " + errorMessage);
  }

});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

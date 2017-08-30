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

// Data:
var cv = require(__dirname + "/data/cv");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// Use Body Parser to process requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Express ES6 Template Engine Settings: https://www.npmjs.com/package/express-es6-template-engine
app.engine('html', es6Renderer);
app.set('views', 'views');
app.set('view engine', 'html');



var db;
db = mongoose.connect(process.env.MONGODB_URI);
var Schema = mongoose.Schema;

var UploadSchema = new Schema({
  url            : String,
  filetype       : String,
  uploadDate     : Date,
  project        : String
});

var Upload = mongoose.model("Upload", UploadSchema);


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
    var bioText = "Rachel is an educator and interdisciplinary media artist. She currently works for Mouse, a youth development nonprofit that believes in technology as a force for good, and is a member of The Illuminator, a political projection collective based in NYC. Rachel is also an avid cyclist, yogi and wanderer. Presently, she is pursuing an MFA in Integrated Media Arts at Hunter College (CUNY).";
    var bioImage = "https://wanderingarrows.s3.amazonaws.com/10-8-2017-20:24:46-IMG_8620.jpg";
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
    var title = "CV";
  
    response.render('index', {
    locals: {
      title: ': ' + title,
      data: cv
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
        
        var newUpload = {
          url: "https://wanderingarrows.s3.amazonaws.com/" + params.Key,
          filetype: filetype,
          uploadDate: date,
          project: "website",
        }
        var dbUpload = new Upload(newUpload);
        
        
        dbUpload.save(function(err) {
          if (err) {
            response.status(400);
            response.send("Error saving to Database");
          } else {
            response.status(200);
            response.send("<img src='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
                      "'><a href='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
                      "'>https://wanderingarrows.s3.amazonaws.com/" + params.Key + "</a><p>Is a " + filetype + " file.");
          }
        });

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

app.get("/uploads", function(request, response) {
  Upload.find(function(err, uploads) {
    if (err) {
      response.status(400);
      response.send("Error getting uploads from DB.")
    }
      response.send(uploads); 
  });
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

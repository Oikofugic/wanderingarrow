// server.js
// where your node app starts

// init project
var express = require('express');
var hbs = require('hbs');
var app = express();
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
		fileSize: 20*1024*1024,
		files: 1
	}
}).single("file");

const fallbackData = require('./fallbackData');


const base = require('airtable').base(process.env.AIRTABLE_BASE);


var DEFAULT_TAB                 = 0; // Could also use the name of a tab like "Trees", or null for no default and just links
var INCLUDE_TIMESTAMP           = false;
// var sheets = require('./modules/sheets');
// sheets.INCLUDE_TIMESTAMP = INCLUDE_TIMESTAMP;

// http://expressjs.com/en/starter/static-files.html
// This makes it so that anything you put in the /public folder will work like a regular web server.
// If you put a file called rachel.html in public whatever you add to that file will show up at:
// www.websiteaddress.com/rachel.html
app.use(express.static('public'));

// Use Body Parser to process requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// hbs Template Engine Settings: https://www.npmjs.com/package/hbs.
// This is telling it what to do with non-js files, particularly the html.
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);



// var db;
// db = mongoose.connect(process.env.MONGODB_URI);
// var Schema = mongoose.Schema;

// var UploadSchema = new Schema({
//   url            : String,
//   filetype       : String,
//   uploadDate     : Date,
//   project        : String
// });

// var Upload = mongoose.model("Upload", UploadSchema);

// function getDataFromSheetAndSendToTemplate(request, response, spreadsheetTab, viewTemplate) {
//   sheets.getData(spreadsheetTab)
//   //declaring sheetdata below, logging it, and "rendering" it which is sending it to the template
//   .then(function(sheetData) {
//     console.log(sheetData.rows);
//     response.render(viewTemplate, {
//         title: ': ' + sheetData.currentWorksheet.title,
//         data: sheetData.rows
//       }
//     );
//     return;
//   })
//   .catch(function(error) {
//     fallback(request, response)
//   }); 
// }

function getDataFromAirtableAndSendToTemplate(request, response, airtableTabName, viewTemplate) {
  asyncAirtable(airtableTabName)
    .then(function(sheetData) {
      response.render(viewTemplate, {
        title: ': ' + sheetData[0]._table.name,
        data: sheetData.map(i => i.fields)
      }
    );
    })
    .catch(function(error) {
      console.log("Error:", error)
      fallback(request, response)
    })
}

function asyncAirtable(tabName) {
  return new Promise((resolve, reject) => {
    base(tabName).select({
      view: 'Grid view'
    }).firstPage(function(err, records) {
      if (err) { reject(err) }
      resolve(records.sort((a,b) => a?.fields?.id - b?.fields?.id))
    });
  })
}


function fallback(request, response) {
 response.render('about', {
   title: ': About',
   hideMenu: true,
   data: [fallbackData]
 }); 
}

app.get("/airtable", function(request, response) {
  asyncAirtable(request?.query?.tab || 'About')
    .then(records => {
      response.json(records)
    })
    .catch(err => {
      console.log("Error:")
      console.error(err)
      response.json({error: err})
    })
})


// About page
app.get("/", function (request, response) {
  getDataFromAirtableAndSendToTemplate(request, response, "About", "about");
});
app.get("/about", function(request, response) {
  response.redirect("/");
})

// CV page
app.get("/cv", function (request, response) {
    getDataFromAirtableAndSendToTemplate(request, response, "CV", "cv");
});

// Disordered page
app.get("/disordered", function (request, response) {
  getDataFromAirtableAndSendToTemplate(request, response, "Disordered", "disordered");
});


// Installations page
app.get("/installations", function (request, response) {
  getDataFromAirtableAndSendToTemplate(request, response, "Installations", "installations");
});

// Music
app.get("/music", function (request, response) {
  getDataFromAirtableAndSendToTemplate(request, response, "Music", "music");
});


// Photography page
app.get("/photography", function (request, response) {
  response.render('photography', {
    title: ': Photography'
  });
});

// The Illuminator page
app.get("/the-illuminator", function (request, response) {
  getDataFromAirtableAndSendToTemplate(request, response, "Illuminator", "the-illuminator");
});

app.get("/illuminator", function(request, response) {
  response.redirect("/the-illuminator");
});

// Video
app.get("/video", function (request, response) {
    getDataFromAirtableAndSendToTemplate(request, response, "Video", "video");
});


// Web / Dreams / doesn't need code because it's its own page at public/dreams/index.html


// Writing
app.get("/writing", function (request, response) {
    response.render('writing', {
      title: ': Writing'
    });
});


// Below here is routes relating to the file upload functionality that connects to Amazon S3


// Upload Test:
app.get("/upload", function(request, response) {
  response.render("upload", {
      title: ": Upload"
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
        
        // var newUpload = {
        //   url: "https://wanderingarrows.s3.amazonaws.com/" + params.Key,
        //   filetype: filetype,
        //   uploadDate: date,
        //   project: "website",
        // }
        // var dbUpload = new Upload(newUpload);
          
        // dbUpload.save(function(err) {
        //   if (err) {
        //     response.status(400);
        //     response.send("Error saving to Database");
        //   } else {
        //     response.status(200);
        //     response.send("<link rel='stylesheet' href='/style.css'>" +
        //               "<img id='upload-image' src='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
        //               "'><br><a href='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
        //               "'>https://wanderingarrows.s3.amazonaws.com/" + params.Key + "</a><p>Is a " + filetype + " file.");
        //   }
        // });
        
        response.status(200);
        response.send("<link rel='stylesheet' href='/style.css'>" +
          "<img id='upload-image' src='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
          "'><br><a href='https://wanderingarrows.s3.amazonaws.com/" + params.Key +
                      "'>https://wanderingarrows.s3.amazonaws.com/" + params.Key + "</a><p>Is a " + filetype + " file.");

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

// app.get("/uploads", function(request, response) {
//   Upload.find(function(err, uploads) {
//     if (err) {
//       response.status(400);
//       response.send("Error getting uploads from DB.")
//     }
//       response.send(uploads); 
//   });
// });


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

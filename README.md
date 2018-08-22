Old site: https://github.com/patrickweaver/wa

# 7/11/17
- set up AWS account and bucket


# 7/20/17
- set up bucket more, created billing alarm
- Put AWS upload code in server.js, hit this error: "Could not load credentials from any providers"
- Using these instructions: https://aws.amazon.com/sdk-for-node-js/


# 8/1/17
- Fixed the AWS upload code in server.js
- Created a AWS user wanderingarrows and access policy of the same name
- Need to figure out how to access file metadata using: https://www.npmjs.com/package/multer


# 8/10/17
- Fixed the upload error which had something to do with the AWS bucket policy and permissions and the order of something in the code (like name first when it should've been second)
- Set up the information that accompanies each upload, including date and project in server.js
- Made an Upload schema in server.js
- Connected it to the heroku database
- Can see uploads here: https://wanderingarrow.glitch.me/uploads

# 8/30/17
- Removed upload from menu, just add upload when you need to
- decided that each page would be unique in structure and started building bio and cv
- made the data/cv.js module
- iterated through templates for CV data
- committed to github

# 9/6/17
- built the disordered and illuminator pages
- added a second section on CV

# 2/8/18
- added comments to explain the mapping in the cv template in html
- added special items to the templates in case we need extra fields for particular datas/sections/items
- added comments in the server.js file to explain some things

# 3/21/18
- added code to the pages (music, writing, etc) that were missing retrieval code
- decided to use our old google spreadsheet to manage contents, and filled in info for music
- added in sheets.js file, that formats the data from spreadsheet
- added in module [google-spreadsheet](https://www.npmjs.com/package/google-spreadsheet) to grab data from spreadsheet
- to do next - format the rows from the music tab, rachel can fill in more info anytime in the CV or other pages! Also rchl should add to spreadsheet with videos, etc.

# 3/29/18
- discussed version control, source control, branches, debugger helps you set break points for testing/errors instead of having to write a million console logs
- formatted rows for music tab in server.js, created a map for it in music.html
- troubleshooted the bandcamp players not showing up, it had to do with https
- started to add styling in css, but it broke, but no bullets works

# 4/12/18
- Started switching from express-es6-template-engine to hbs (handlebars), but patrick isn't really sure that's the right thing to do he'll think about it.
- Maybe this will be helpful [https://stackoverflow.com/questions/9203858/how-do-i-use-nested-iterators-with-mustache-js-or-handlebars-js](https://stackoverflow.com/questions/9203858/how-do-i-use-nested-iterators-with-mustache-js-or-handlebars-js)

# 4/19/18
- fixed all the pages to work with handlebars in the server.js
- updated the music template to work with the spreadsheet and handlebars
- we need to fix the cv page next time, and make sure it is getting it's info from the spreadsheet, and generalize the getting of info from the spreadsheet for all the sections that use it

# 4/25/18
- generalized the getting of info from the spreadsheet
- updated cv.html & bio.html to use that data

# 5/2/18
- set up video page to pull from spreadsheet
- edited the video spreadsheet tab
- renamed Web to Dreams & deleted Web.html
- set up individual pages for dream project
- cleaned up music page

# 5/21/18
- looked at Dreams files and assessed that we should launch without it and maybe figure it out later
- To Do Next
- fix CSS for CV & Video tab
- Rachel needs to update Disordered info, photo, video, paper
- Rachel needs to fill in the installations info
- https://wanderingarrow.glitch.me/upload for uploading before we move site off glitch

# 6/14/18
- Added CSS for CV, fussed with it for a while, not quite done, still need to do CSS for Video tab
- Fixed CV tab in spreadsheet so that all descriptions have html in them
- RB updated half of Disordered, still more to be done, as well as installations

# 6/25/18
- RB updated spreadsheet, mostly CV stuff
- RB changed bio to about

# 6/28/18
- Removed home page, made about the landing
- Hid writing from menu
- Started fixing css for video page

# 8/1/18
- connected installations spreadsheet data
- tweaked CSS for various pages, added wrap, fonts

# 8/9/18
- We moved Illuminator and Disordered from the html templates to the spreadsheet and connected them, and tweaked their css
- We updated the templates for special cases like th photos in disordered
- We added more bottom margin to everything , fixed line height for headers, fixed resizing of videos for small screens, added wrap to installations text
- Rachel needs to add more disordered photos, redo the video embeds
- we need to revisit the wraps on different pages, lists/bullets and if we want consistency
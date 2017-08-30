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


const express = require('express');
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
import {graphqlHTTP} from 'express-graphql'
import mongoose from 'mongoose';
import schema from './schema';

const app = express();
const cors = require("cors");
// store something
await s3.putObject({
    Body: JSON.stringify({key:"value"}),
    Bucket: "cyclic-thankful-gown-ox-eu-west-1",
    Key: "some_files/my_file.json",
}).promise()

// get it back
let my_file = await s3.getObject({
    Bucket: "cyclic-thankful-gown-ox-eu-west-1",
    Key: "some_files/my_file.json",
}).promise()

console.log(JSON.parse(my_file))

app.get('*', async (req,res) => {
    let filename = req.path.slice(1)

    try {
        let s3File = await s3.getObject({
            Bucket: process.env.BUCKET,
            Key: filename,
        }).promise()

        res.set('Content-type', s3File.ContentType)
        res.send(s3File.Body.toString()).end()
    } catch (error) {
        if (error.code === 'NoSuchKey') {
            console.log(`No such key ${filename}`)
            res.sendStatus(404).end()
        } else {
            console.log(error)
            res.sendStatus(500).end()
        }
    }
})


// curl -i -XPUT --data '{"k1":"value 1", "k2": "value 2"}' -H 'Content-type: application/json' https://some-app.cyclic.app/myFile.txt
app.put('*', async (req,res) => {
    let filename = req.path.slice(1)

    console.log(typeof req.body)

    await s3.putObject({
        Body: JSON.stringify(req.body),
        Bucket: process.env.BUCKET,
        Key: filename,
    }).promise()

    res.set('Content-type', 'text/plain')
    res.send('ok').end()
})

// curl -i -XDELETE https://some-app.cyclic.app/myFile.txt
app.delete('*', async (req,res) => {
    let filename = req.path.slice(1)

    await s3.deleteObject({
        Bucket: process.env.BUCKET,
        Key: filename,
    }).promise()

    res.set('Content-type', 'text/plain')
    res.send('ok').end()
})

// /////////////////////////////////////////////////////////////////////////////
// Catch all handler for all other request.
app.use('*', (req,res) => {
    res.sendStatus(404).end()
})

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}, (error) => {
    if (error) {
        console.error(error);
    } else {
        app.listen(process.env.LISTEN_PORT || 3001, () => {
            console.log('Listening on port 3001');
        });
        console.info('Connect with database established');
    }
});

process.on('SIGINT', () => {
    mongoose.connection.close(function () {
        console.error('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});
app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true

}));



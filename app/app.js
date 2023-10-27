
const express = require('express');

import {graphqlHTTP} from 'express-graphql'
import mongoose from 'mongoose';
import schema from './schema';

const app = express();
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}, (error) => {
    if (error) {
        console.error(error);
    } else {
        app.listen(process.env.PORT, () => {
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



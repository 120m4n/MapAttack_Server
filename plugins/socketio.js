'use strict'

const fp = require('fastify-plugin')

// @ts-ignore
module.exports = fp(async function (fastify, opts) {
    // serve static files from the public folder
    fastify.register(require('fastify-socket.io'), {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    fastify.ready(async err => {
        if (err) throw err;
        // console.log('before connect', fastify.io);
        // fastify.io.on('connect', (socket) => {
        //     console.info('Socket connected!', socket.id);
        // })
    
        fastify.io.on('connection', (socket) => {
            console.log('a user connected: ' + socket.id);
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });

        fastify.io.on('disconnect', (reason) => {
          console.log('fastify.disconnect', reason);
        })
    });
})
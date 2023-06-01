'use strict'

const fp = require('fastify-plugin')

// @ts-ignore
module.exports = fp(async function (fastify, opts) {
    // serve static files from the public folder
    fastify.register(require('@fastify/cors'), {
        origin: "*",
        methods: ["GET", "POST"]
    });
})
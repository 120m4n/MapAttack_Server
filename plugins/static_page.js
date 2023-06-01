'use strict'

const fp = require('fastify-plugin')
const path = require('path')

// @ts-ignore
module.exports = fp(async function (fastify, opts) {
    // serve static files from the public folder
    fastify.register(require('@fastify/static'), {
        root: path.join(__dirname, '../public'),
        prefix: '/public/',
        list: true
    });
})
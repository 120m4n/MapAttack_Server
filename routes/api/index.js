// @ts-nocheck
'use strict'
var Tile38 = require('tile38');
const S = require('fluent-json-schema')
var client = new Tile38();

const bounds = [-73, 7, -72, 7.24];

//generate a function that returns a random number between min and max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//generate a function that return coordinates within the bounds
function getRandomCoordinates(bounds) {
    var minLat = bounds[1];
    var maxLat = bounds[3];
    var minLon = bounds[0];
    var maxLon = bounds[2];

    var lat = getRandomArbitrary(minLat, maxLat);
    var lon = getRandomArbitrary(minLon, maxLon);

    return [lat, lon];
}

const positionSchema = S.object()
    .prop('lat', S.number().required())
    .prop('lon', S.number().required())



const bodyJsonSchema = S.object()
    .prop('positon', positionSchema)
    .prop('fleet', S.string().required())
    .prop('userid', S.string().required())

const paramsJsonSchema = S.object()
    .prop('unique_id', S.string().required())


const schema = {
    body: bodyJsonSchema,
    params: paramsJsonSchema
}

module.exports = async function (fastify, opts) {
    fastify.get('/savepoint', async function (request, reply) {
        fastify.io.emit('message', 'Hello, world!')
        var coords = getRandomCoordinates(bounds);
        // save a location
        client.set('fleet', 'truck1', coords);
        reply.code(200).send({
            "lat": coords[0],
            "lon": coords[1]
        });
    })

    fastify.get('/nearby', async function (request, reply) {
        // get nearby vehicles
        var nearby = await client.get('fleet', 'truck1');
        return nearby;
    })

    fastify.get('/init', async function (request, reply) {
        let sucess = await client.scanQuery('avatar').objects().execute();   
        return sucess;
    })

    fastify.post('/coordinates/:unique_id', { schema }, async function (request, reply) {
        const { unique_id } = request.params
        const { body } = request
        const { position, fleet, userid } = body
        const { lat, lon } = position
        // save a location
        client.set('avatar', unique_id, [lat, lon], {
            userid: userid,
            fleet: fleet
        });
        fastify.io.emit('update:position', {
            coordinates : [lon, lat],
            id : unique_id,
            name : userid
        })
        reply.code(200).send({
            "fleet": fleet,
            "unique_id": unique_id,
            "position": position
        });
    })

}

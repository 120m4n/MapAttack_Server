var Tile38 = require('tile38');
var client = new Tile38();
var wkx = require('wkx');


function extractNameAndObjectProperty(array) {
    // console.log(array)
    const results = [];


  
    for (const element of array) {
      const name = element.name;
      const command = element.command;

      //check if command contains OBJECT property, else skip
        if (!command.includes('OBJECT')) {
            continue;
        }
        
      // geojson is the next element after the object property
      const index = command.indexOf('OBJECT');
      const geojson = command[index + 1];
      const meta = element.meta || {};
  
      results.push({
        name,
        meta,
        geojson: JSON.parse(geojson),
      });
    }
  
    return results;
}


module.exports = async function (fastify, opts) {
    fastify.post('/set', async function (request, reply) {
        let geometry = wkx.Geometry.parse(request.body.geoData)
        let fenceId = request.body.fenceId;
        let points = request.body.points || '0';
        let sucess = await client.setHook(fenceId,
            `http://192.168.1.7:3000/hook/areaProtegida`,
            {
                "type": "checkin",
                "message": "You have entered the area",
                "points": points
            },
            'INTERSECTS',
            'avatar',
            {
                'detect' : 'enter,exit',
                'object' : geometry.toGeoJSON()
            }); 
        reply.code(200).send({
            "sucess": sucess,
            "fenceId": fenceId,
            "geoData": request.body.geoData
        })
    })

    fastify.post('/del', async function (request, reply) {
        let fenceId = request.body.fenceId
        let sucess = await client.delhook(fenceId); 
        reply.code(200).send({
            "sucess": sucess,
            "fenceId": fenceId
        })
    })

    fastify.get('/hooks', async function (request, reply) {
        let rawResponse = await client.executeCommand('HOOKS *', { returnProp: 'hooks'})
        console.log(rawResponse)
        // let hooks = []
        // for (let i = 0; i < keys.length; i++) {
        //     let hook = await client.hooks(keys[i])
        //     hooks.push(hook)
        // }
        reply.code(200).send({
            "hooks": extractNameAndObjectProperty(rawResponse)
        })
    })

}
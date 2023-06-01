module.exports = async function (fastify, opts) {
    fastify.post('/areaProtegida', async function (request, reply) {
        const body = request.body
        // console.log(body)
        fastify.io.emit('message', body)
        reply.code(200).send({
            "sucess": true,
        })
    })
}
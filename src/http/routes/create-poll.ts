import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { FastifyInstance } from 'fastify'

export async function createPoll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {
    const createPollBoddy = z.object({
      title: z.string(),
      options: z.array(z.string()),
    })
  
    const { title, options } = createPollBoddy.parse(request.body)
  
    const poll = await  prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map(option => {
              return { title: option }
            })
          }
        },
      }
    })
  
    return reply.code(201).send({ pollID: poll.id })
  })
}
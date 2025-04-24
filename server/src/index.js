const Fastify = require('fastify');
const cors = require('@fastify/cors');
const jwt = require('@fastify/jwt');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma
const prisma = new PrismaClient();

// Create Fastify instance
const fastify = Fastify({
  logger: true
});

// Register plugins
fastify.register(cors, {
  origin: true
});

fastify.register(jwt, {
  secret: process.env.JWT_SECRET
});

// Authentication decorator
fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Routes
fastify.get('/', async (request, reply) => {
  return { status: 'ok', message: 'Trek Snout API' };
});

// Pets routes (authenticated)
fastify.register(async function (fastify) {
  // Get all pets for authenticated user
  fastify.get('/pets', async (request, reply) => {
    const userId = request.user.sub;
    
    const pets = await prisma.pet.findMany({
      where: {
        userId
      }
    });
    
    return pets;
  });
  
  // Get a single pet
  fastify.get('/pets/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.sub;
    
    const pet = await prisma.pet.findFirst({
      where: {
        id,
        userId
      },
      include: {
        hikes: {
          orderBy: {
            startTime: 'desc'
          },
          take: 5
        }
      }
    });
    
    if (!pet) {
      reply.code(404).send({ error: 'Pet not found' });
      return;
    }
    
    return pet;
  });
  
  // Create a new pet
  fastify.post('/pets', async (request, reply) => {
    const userId = request.user.sub;
    const petData = request.body;
    
    const pet = await prisma.pet.create({
      data: {
        ...petData,
        userId
      }
    });
    
    return pet;
  });
  
  // Hikes routes
  fastify.get('/hikes/:id', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.sub;
    
    const hike = await prisma.hike.findFirst({
      where: {
        id,
        userId
      },
      include: {
        pet: true,
        locations: {
          orderBy: {
            timestamp: 'asc'
          }
        }
      }
    });
    
    if (!hike) {
      reply.code(404).send({ error: 'Hike not found' });
      return;
    }
    
    return hike;
  });
  
  // Start a new hike
  fastify.post('/hikes', async (request, reply) => {
    const userId = request.user.sub;
    const { petId } = request.body;
    
    const hike = await prisma.hike.create({
      data: {
        petId,
        userId
      }
    });
    
    return hike;
  });
  
  // Add location to hike
  fastify.post('/hikes/:id/locations', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.sub;
    const { latitude, longitude, elevation } = request.body;
    
    // Verify hike belongs to user
    const hike = await prisma.hike.findFirst({
      where: {
        id,
        userId
      }
    });
    
    if (!hike) {
      reply.code(404).send({ error: 'Hike not found' });
      return;
    }
    
    // Create GeoJSON point for PostGIS
    const point = JSON.stringify({
      type: 'Point',
      coordinates: [longitude, latitude]
    });
    
    const location = await prisma.hikeLocation.create({
      data: {
        hikeId: id,
        location: point,
        elevation
      }
    });
    
    return location;
  });
  
  // End a hike
  fastify.patch('/hikes/:id/end', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.sub;
    const { distance } = request.body;
    
    const hike = await prisma.hike.update({
      where: {
        id
      },
      data: {
        endTime: new Date(),
        distance
      }
    });
    
    return hike;
  });
}, { prefix: '/api', decorators: ['authenticate'] });

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start(); 
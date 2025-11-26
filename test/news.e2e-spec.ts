import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
// Asegúrate de que esta ruta sea correcta según tu estructura de carpetas
import { CreateNewsDto } from './../src/news/dto/create-news.dto';
import { News } from '@prisma/client';

describe('NewsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let newsId: number;

  // 1. CONFIGURACIÓN INICIAL
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  // 2. LIMPIEZA FINAL
  afterAll(async () => {
    if (newsId) {
      await prisma.news.delete({ where: { id: newsId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  // --- TEST 1: CREACIÓN (POST) ---
  it('/api/news (POST) - Debería crear una nueva noticia', async () => {
    const newNews: CreateNewsDto = {
      title: 'Noticia de Prueba NestJS',
      body: 'Cuerpo de la noticia generada por el test e2e de NestJS.',
      author: 'Robot Nest',
      image_url: 'https://via.placeholder.com/150',
    };

    // Usamos 'as unknown' aquí para evitar el error "unsafe argument" sin desactivar ESLint
    return request(app.getHttpServer())
      .post('/api/news')
      .send(newNews)
      .expect(201)
      .expect((res) => {
        // SOLUCIÓN PRO: Casteamos el body a News aquí dentro
        const body = res.body as News;

        expect(body.title).toEqual(newNews.title);
        expect(body).toHaveProperty('id');

        // Guardamos el ID de forma segura
        newsId = body.id;
      });
  });

  // --- TEST 2: LECTURA (GET BY ID) ---
  it('/api/news/:id (GET) - Debería leer la noticia creada', async () => {
    return request(app.getHttpServer())
      .get(`/api/news/${newsId}`)
      .expect(200)
      .expect((res) => {
        // SOLUCIÓN PRO: Casteamos y verificamos
        const body = res.body as News;

        expect(body.id).toEqual(newsId);
        expect(body.author).toEqual('Robot Nest');
      });
  });

  // --- TEST 3: ACTUALIZACIÓN (PATCH) ---
  it('/api/news/:id (PATCH) - Debería actualizar el título', async () => {
    const updates = {
      title: 'Título Actualizado por NestJS',
    };

    return request(app.getHttpServer())
      .patch(`/api/news/${newsId}`)
      .send(updates)
      .expect(200)
      .expect((res) => {
        // SOLUCIÓN PRO: Casteamos y verificamos
        const body = res.body as News;

        expect(body.title).toEqual(updates.title);
      });
  });

  // --- TEST 4: ELIMINACIÓN (DELETE) ---
  it('/api/news/:id (DELETE) - Debería eliminar la noticia', async () => {
    return request(app.getHttpServer())
      .delete(`/api/news/${newsId}`)
      .expect(200);
  });

  // --- TEST 5: VERIFICACIÓN 404 ---
  it('/api/news/:id (GET) - Debería dar 404 al buscar la noticia borrada', async () => {
    return request(app.getHttpServer()).get(`/api/news/${newsId}`).expect(404);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('NewsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let newsId: number;

  // 1. CONFIGURACIÓN INICIAL (ANTES DE TODOS LOS TESTS)
  beforeAll(async () => {
    // Compilamos el módulo principal (simulamos arrancar la app)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // ⚠️ IMPORTANTE: Configurar igual que en main.ts
    app.setGlobalPrefix('api'); 
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true 
    }));

    await app.init();

    // Obtenemos el servicio de Prisma para limpiar o verificar datos directos
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  // 2. LIMPIEZA FINAL (DESPUÉS DE TODOS LOS TESTS)
  afterAll(async () => {
    // Opcional: Limpiar la noticia de prueba
    if (newsId) {
      await prisma.news.delete({ where: { id: newsId } }).catch(() => {});
    }
    await prisma.$disconnect();
    await app.close();
  });

  // --- TEST 1: CREACIÓN (POST) ---
  it('/api/news (POST) - Debería crear una nueva noticia', async () => {
    const newNews = {
      title: "Noticia de Prueba NestJS",
      body: "Cuerpo de la noticia generada por el test e2e de NestJS.",
      author: "Robot Nest",
      image_url: "https://via.placeholder.com/150"
    };

    return request(app.getHttpServer())
      .post('/api/news')
      .send(newNews)
      .expect(201) // Esperamos Created
      .expect((res) => {
        expect(res.body.title).toEqual(newNews.title);
        expect(res.body).toHaveProperty('id');
        // Guardamos el ID para los siguientes tests
        newsId = res.body.id;
      });
  });

  // --- TEST 2: LECTURA (GET BY ID) ---
  it('/api/news/:id (GET) - Debería leer la noticia creada', async () => {
    return request(app.getHttpServer())
      .get(`/api/news/${newsId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(newsId);
        expect(res.body.author).toEqual("Robot Nest");
      });
  });

  // --- TEST 3: ACTUALIZACIÓN (PATCH) ---
  // Nota: En NestJS se suele usar PATCH para actualizaciones parciales
  it('/api/news/:id (PATCH) - Debería actualizar el título', async () => {
    const updates = {
      title: "Título Actualizado por NestJS"
    };

    return request(app.getHttpServer())
      .patch(`/api/news/${newsId}`)
      .send(updates)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toEqual(updates.title);
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
    return request(app.getHttpServer())
      .get(`/api/news/${newsId}`)
      .expect(404); // NestJS devuelve 404 automáticamente si findUnique retorna null (si está bien configurado) o si el servicio lanza NotFoundException
  });
});
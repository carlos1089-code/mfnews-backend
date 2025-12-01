import { Test, TestingModule } from '@nestjs/testing';
import { NewsService } from './news.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NewsService', () => {
  let service: NewsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    news: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar todas las noticias ordenadas por fecha', async () => {
      const mockNoticias = [
        { id: 1, title: 'Noticia 1', subtitle: 'Subtítulo 1', author: 'Carlos', body: 'Contenido 1', date: new Date() },
        { id: 2, title: 'Noticia 2', subtitle: 'Subtítulo 2', author: 'Ana', body: 'Contenido 2', date: new Date() },
      ];

      mockPrismaService.news.findMany.mockResolvedValue(mockNoticias);

      const result = await service.findAll();

      expect(result).toEqual(mockNoticias);
      expect(prisma.news.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { date: 'desc' },
      });
    });

    it('debería filtrar por búsqueda cuando se proporciona un término', async () => {
      const searchTerm = 'SpaceX';
      mockPrismaService.news.findMany.mockResolvedValue([]);

      await service.findAll(searchTerm);

      expect(prisma.news.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { author: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        orderBy: { date: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('debería retornar una noticia cuando existe', async () => {
      const mockNoticia = {
        id: 1,
        title: 'Noticia Test',
        subtitle: 'Subtítulo Test',
        author: 'Carlos',
        body: 'Contenido',
        date: new Date(),
      };

      mockPrismaService.news.findUnique.mockResolvedValue(mockNoticia);

      const result = await service.findOne(1);

      expect(result).toEqual(mockNoticia);
      expect(prisma.news.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar NotFoundException cuando la noticia no existe', async () => {
      mockPrismaService.news.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'La noticia con ID 999 no existe',
      );
    });
  });

  describe('create', () => {
    it('debería crear una noticia correctamente', async () => {
      const createDto = {
        title: 'Nueva Noticia',
        subtitle: 'Subtítulo de prueba',
        body: 'Contenido de prueba',
        author: 'Carlos',
      };

      const mockCreated = {
        id: 1,
        ...createDto,
        date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPrismaService.news.create.mockResolvedValue(mockCreated);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreated);
      expect(prisma.news.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('debería actualizar una noticia existente', async () => {
      const updateDto = { title: 'Título Actualizado' };
      const mockExisting = { id: 1, title: 'Título Original' };
      const mockUpdated = { id: 1, title: 'Título Actualizado' };

      mockPrismaService.news.findUnique.mockResolvedValue(mockExisting);
      mockPrismaService.news.update.mockResolvedValue(mockUpdated);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(mockUpdated);
      expect(prisma.news.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDto,
      });
    });

    it('debería lanzar NotFoundException si la noticia no existe', async () => {
      mockPrismaService.news.findUnique.mockResolvedValue(null);

      await expect(service.update(999, { title: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('debería eliminar una noticia existente', async () => {
      const mockNoticia = { id: 1, title: 'Noticia a eliminar' };

      mockPrismaService.news.findUnique.mockResolvedValue(mockNoticia);
      mockPrismaService.news.delete.mockResolvedValue(mockNoticia);

      const result = await service.remove(1);

      expect(result).toEqual(mockNoticia);
      expect(prisma.news.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería lanzar NotFoundException si la noticia no existe', async () => {
      mockPrismaService.news.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});


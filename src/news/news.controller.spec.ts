import { Test, TestingModule } from '@nestjs/testing';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { JwtService } from '@nestjs/jwt';

describe('NewsController', () => {
  let controller: NewsController;
  let service: NewsService;

  // Mock del NewsService
  const mockNewsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Mock del JwtService (necesario para AuthGuard)
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        {
          provide: NewsService,
          useValue: mockNewsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    service = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería devolver un array de noticias', async () => {
      // A. PREPARAR (Arrange)
      const resultEsperado = [
        { id: 1, title: 'Noticia de Prueba', author: 'Carlos', body: 'Contenido' },
      ];

      jest.spyOn(mockNewsService, 'findAll').mockResolvedValue(resultEsperado);

      // B. ACTUAR (Act)
      const result = await controller.findAll();

      // C. VERIFICAR (Assert)
      expect(result).toEqual(resultEsperado);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('debería pasar el parámetro de búsqueda al servicio', async () => {
      const searchTerm = 'SpaceX';
      mockNewsService.findAll.mockResolvedValue([]);

      await controller.findAll(searchTerm);

      expect(service.findAll).toHaveBeenCalledWith(searchTerm);
    });
  });

  describe('findOne', () => {
    it('debería devolver una noticia específica', async () => {
      const mockNoticia = { id: 1, title: 'Noticia Test' };
      mockNewsService.findOne.mockResolvedValue(mockNoticia);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockNoticia);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('debería crear una nueva noticia', async () => {
      const createDto = { title: 'Nueva', body: 'Contenido', author: 'Carlos' };
      const mockCreated = { id: 1, ...createDto };
      mockNewsService.create.mockResolvedValue(mockCreated);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCreated);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('debería actualizar una noticia existente', async () => {
      const updateDto = { title: 'Actualizada' };
      const mockUpdated = { id: 1, title: 'Actualizada' };
      mockNewsService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(mockUpdated);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('debería eliminar una noticia', async () => {
      const mockDeleted = { id: 1, title: 'Eliminada' };
      mockNewsService.remove.mockResolvedValue(mockDeleted);

      const result = await controller.remove(1);

      expect(result).toEqual(mockDeleted);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
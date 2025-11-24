import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AiService implements OnModuleInit {
  private pipeline: any;

  // Se ejecuta cuando arranca la app para cargar el modelo en memoria
  async onModuleInit() {
    console.log('🤖 Cargando modelo de IA (puede tardar un poco la primera vez)...');
    
    // Importación dinámica necesaria para esta librería
    const { pipeline } = await import('@xenova/transformers');
    
    // "all-MiniLM-L6-v2" es un modelo rápido y ligero, ideal para CPU
    this.pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    console.log('✅ Modelo de IA cargado y listo.');
  }

  // Esta función convierte "Hola mundo" -> [0.01, -0.23, ...]
  async generateEmbedding(text: string): Promise<number[]> {
    const output = await this.pipeline(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}
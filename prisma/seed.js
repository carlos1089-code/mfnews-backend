const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seeding (Modo: Picsum Photos)...');

  // 1. Limpieza de tablas (primero News para no romper integridad referencial, luego User)
  try {
    await prisma.news.deleteMany();
    await prisma.user.deleteMany();
    console.log('🗑️ Base de datos limpiada.');
  } catch (e) {
    console.warn('⚠️ Advertencia: Tablas posiblemente vacías o error al limpiar.');
  }

  // 2. Crear Usuarios (Admin y User)
  // Nota: La contraseña es un hash de ejemplo. En producción usa bcrypt.
  const passwordHash = "$2b$10$EpIxt.H4c/w/mF0v5WzRxe.j6Ff/w/mF0v5WzRxe.j6Ff9Z2Z2"; 

  await prisma.user.createMany({
    data: [
      {
        name: "Administrador",
        email: "admin@noticias.com",
        password: passwordHash,
        role: "ADMIN",
      },
      {
        name: "Usuario Lector",
        email: "user@noticias.com",
        password: passwordHash,
        role: "USER",
      },
    ],
  });
  console.log('👤 Usuarios creados correctamente.');

  // 3. Datos de Noticias (Usando Picsum con ?random para evitar caché y errores)
  // Dimensiones: 800x600 para que carguen rápido y se vean bien en tarjetas.
  const newsData = [
    {
      title: "SpaceX logra un aterrizaje histórico",
      body: "En un hito sin precedentes para la ingeniería aeroespacial, la compañía logró capturar el propulsor en el aire utilizando los brazos mecánicos de la torre de lanzamiento.",
      image_url: "https://picsum.photos/800/600?random=1", // Random 1
      author: "Carlos Nayi",
      date: new Date(),
    },
    {
      title: "El Banco Central anuncia nuevas tasas de interés",
      body: "Tras conocerse el último índice de inflación, la entidad monetaria ha decidido ajustar la tasa de referencia. Los analistas advierten sobre el impacto en el consumo.",
      image_url: "https://picsum.photos/800/600?random=2", // Random 2
      author: "Ana Economía",
      date: new Date(Date.now() - 86400000), // Ayer
    },
    {
      title: "Final electrizante en el torneo local",
      body: "El partido terminó con goles en los últimos minutos. La polémica del VAR fue la protagonista de la noche, anulando un gol decisivo.",
      image_url: "https://picsum.photos/800/600?random=3", // Random 3
      author: "Juan Deportes",
      date: new Date(Date.now() - 3600000), // Hace 1 hora
    },
    {
      title: "Ola de calor: Se esperan temperaturas récord",
      body: "El servicio meteorológico ha emitido una alerta naranja. Se recomienda evitar la exposición al sol entre las 11 y las 16 horas.",
      image_url: "https://picsum.photos/800/600?random=4", // Random 4
      author: "Clima 24h",
      date: new Date(Date.now() - 172800000), // Anteayer
    },
    {
      title: "Nuevas gafas de realidad mixta llegan al mercado",
      body: "La compañía busca masificar la computación espacial con un modelo más accesible, eliminando funciones 'Pro' para reducir el precio.",
      image_url: "https://picsum.photos/800/600?random=5", // Random 5
      author: "Tech Reviewer",
      date: new Date(),
    },
    {
      title: "Descubren ruinas antiguas en la selva",
      body: "Utilizando tecnología láser, arqueólogos han mapeado una extensa red de asentamientos ocultos bajo la densa vegetación.",
      image_url: "https://picsum.photos/800/600?random=6", // Random 6
      author: "National Geo",
      date: new Date(),
    },
    {
      title: "El auge del café de especialidad",
      body: "Cada vez más cafeterías ofrecen granos de origen único. Expertos aseguran que el paladar del consumidor ha evolucionado notablemente.",
      image_url: "https://picsum.photos/800/600?random=7", // Random 7
      author: "Barista Pro",
      date: new Date(),
    },
    {
      title: "Arquitectura sustentable: Casas 3D",
      body: "Una startup está construyendo barrios enteros utilizando hormigón bajo en carbono y robots gigantes de impresión.",
      image_url: "https://picsum.photos/800/600?random=8", // Random 8
      author: "Arq. Pérez",
      date: new Date(),
    }
  ];

  await prisma.news.createMany({ data: newsData });
  console.log(`✅ Seeding completado: ${newsData.length} noticias generadas con imágenes de Picsum.`);
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  });
  //api swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Jay Luy API')
    .setDescription(
      'this is jay luy api, you can do database manipulation through this ui',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http', 
      scheme: 'bearer', 
      bearerFormat: 'JWT', // This is optional but adds clarity
      },
      'JWT',)
    .addTag('Expense Tracker')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    customfavIcon:
      'https://res-console.cloudinary.com/dlbbfck9n/media_explorer_thumbnails/e21d9307936995dc631dc520ee985775/detailed',
    customSiteTitle: 'JayLuy API',
    customCss: '.topbar { display: none; }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 4001);
  console.log(`app run on http://localhost:4001`);
}
bootstrap();

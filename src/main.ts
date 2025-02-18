import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //api swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Jay Loy API')
    .setDescription(
      'this is jay loy api, you can do database manipulation through this ui',
    )
    .setVersion('1.0')
    .addTag('Expense Tracker')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    customfavIcon:
      '✅',
    customSiteTitle: 'JayLoy API',
    customCss: '.topbar { display: none; }',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(`app run on http://localhost:3000`);
}
bootstrap();

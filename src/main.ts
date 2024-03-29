import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //modify
  const port = 3000;

  const config = new DocumentBuilder()
    .setTitle('Best Friend API')
    .setDescription('The Best Friend API description')
    .setVersion('1.0')
    .addTag('Best Friend')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, '127.0.0.1');
  console.log(`==================listening on port ${port}==================`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

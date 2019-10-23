import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Microservicio de descuentos')
    .setDescription(`
    Este microservicio se encarga de aplicar códigos de cupones de descuento a artículos que tenga en el carro de compras.
    También se encarga de listar, crear, eliminar descuentos en el sistema.
    
    Las reglas parametrizables son:
    Si la fecha actual es menor o igual a la fecha de fin de canje del cupón y canjeado es igual falso, entonces el código tiene el estado “Válido para ser canjeado”
    Si la fecha actual es mayor a la fecha de fin de canje del cupón, entonces el código tiene el estado “Inválido para ser canjeado”
    Si canjeado es igual a verdadero, entonces el código tiene el estado “Código canjeado”
    
    Para realizar estas acciones, el microservicio se comunica con los siguientes recursos:
    
    Auth: Para la administración de los códigos de descuento existentes en el sistema, se debe validar que el usuario sea Admin.
    RabbitMQ: 
    Envía las notificaciones y alertas cuando se realiza una modificación de un descuento, para ser aplicado en las transacciones pendientes que tengan artículos que apliquen ese descuento.
    Envia una notificacion tipo fanout la cual notifica los datos del descuento una vez que se ha aplicado a una orden.
    `)
    .setVersion('1.0')
    .addTag('discounts')
    .addTag('redeem')
    .addTag('search-discounts')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://localhost:5672`],
      queue: 'my_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservicesAsync();
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
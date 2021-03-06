import * as amqp from 'amqplib';
import { ClientProxy } from '@nestjs/microservices';

export class RabbitMQClient extends ClientProxy {
  connect(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  close() {
    throw new Error("Method not implemented.");
  }
  protected publish(packet: import("@nestjs/microservices").ReadPacket<any>, callback: (packet: import("@nestjs/microservices").WritePacket<any>) => void): Function {
    throw new Error("Method not implemented.");
  }
  protected dispatchEvent<T = any>(packet: import("@nestjs/microservices").ReadPacket<any>): Promise<T> {
    throw new Error("Method not implemented.");
  }
  constructor(
    private readonly host: string,
    private readonly queue: string) {
      super();
    }

  protected async sendSingleMessage(messageObj, callback: (err, result, disposed?: boolean) => void) {
    const server = await amqp.connect(this.host);
    const channel = await server.createChannel();

    const { sub, pub } = this.getQueues();
    channel.assertQueue(sub, { durable: false });
    channel.assertQueue(pub, { durable: false });

    channel.consume(pub, (message) => this.handleMessage(message, server, callback), { noAck: true });
    channel.sendToQueue(sub, Buffer.from(JSON.stringify(messageObj)));
  }

  private handleMessage(message, server, callback: (err, result, disposed?: boolean) => void) {
    const { content } = message;
    const { err, response, disposed } = JSON.parse(content.toString());
    if (disposed) {
        server.close();
    }
    callback(err, response, disposed);
  }

  private getQueues() {
    return { pub: `${this.queue}_pub`, sub: `${this.queue}_sub` };
  }
}
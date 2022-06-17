import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Admin, Consumer, Kafka, Producer } from "kafkajs";
import {
  FILTER_NFT_DATA_SERVICE,
  FILTER_NFT_DATA_TOPIC,
  NUM_PARTITIONS,
  REPLICATION_FACTOR,
  WALLET_REQUEST_TOPIC,
} from "src/app.constants";
import { WalletRequestDto } from "src/dto";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private admin: Admin;
  private consumer: Consumer;
  private producer: Producer;
  private logger: Logger;
  private kafka: Kafka;
  constructor(
    @Inject(FILTER_NFT_DATA_SERVICE) private readonly clientKafka: ClientKafka // @Inject(KAFKA) private readonly kafka: Kafka,
  ) {
    this.logger = new Logger(KafkaService.name);
    this.kafka = this.clientKafka.createClient<Kafka>();
  }
  async onModuleDestroy() {
    this.logger.verbose("Kafka service shutting down...");
    await this.admin.disconnect();
    await this.producer.disconnect();
  }

  async onModuleInit() {
    await this.initializeAdmin();
    // await this.initializeConsumer();
    await this.initializeProducer();
  }
  async initializeAdmin() {
    this.logger.verbose("Admin initializing...");
    this.admin = this.kafka.admin();
    await this.admin.connect();
    const isTopicCreated = await this.createTopics();
    if (!isTopicCreated) {
      this.logger.verbose(`${FILTER_NFT_DATA_TOPIC} topic already exist with ${NUM_PARTITIONS} partitions...`);
      return;
    }
    this.logger.verbose(`Creating ${FILTER_NFT_DATA_TOPIC} with ${NUM_PARTITIONS} partitions...`);
  }
  async initializeProducer() {
    this.logger.verbose("Producer initializing...");

    this.producer = this.kafka.producer({
      idempotent: true,
    });

    await this.producer.connect();
  }

  async send(topic: string, dto: any, partition: number) {
    await this.producer.send({
      topic,
      acks: -1,
      messages: [{ value: JSON.stringify(dto), partition }],
    });
  }
  async createTopics(): Promise<boolean> {
    try {
      return await this.admin.createTopics({
        topics: [
          {
            topic: FILTER_NFT_DATA_TOPIC,
            numPartitions: NUM_PARTITIONS,
            replicationFactor: REPLICATION_FACTOR,
          },
        ],
      });
    } catch (err) {
      this.logger.error("Error creating topic", err);
    }
  }
}

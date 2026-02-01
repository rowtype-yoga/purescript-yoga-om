// FFI implementation for Kafka integration
// This would use kafkajs: npm install kafkajs

const { Kafka } = require('kafkajs');

/**
 * Create a Kafka consumer
 * @param {Object} config - { brokers, groupId, clientId }
 * @returns {Promise<Object>} Consumer object
 */
exports.createConsumer = (config) => async () => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers
  });

  const consumer = kafka.consumer({ 
    groupId: config.groupId,
    // Enable automatic offset management
    sessionTimeout: 30000,
    rebalanceTimeout: 60000,
  });

  await consumer.connect();

  return {
    subscribe: (topic) => async () => {
      await consumer.subscribe({ 
        topic, 
        fromBeginning: false 
      });
    },

    consume: (timeoutMs) => async () => {
      const messages = [];
      
      await consumer.run({
        // Process batch
        eachBatchAutoResolve: true,
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
          for (let message of batch.messages) {
            if (!isRunning() || isStale()) break;
            
            messages.push({
              topic: batch.topic,
              partition: batch.partition,
              offset: message.offset,
              key: message.key ? message.key.toString() : '',
              value: message.value ? message.value.toString() : '',
              timestamp: message.timestamp,
              headers: message.headers || []
            });

            await resolveOffset(message.offset);
            await heartbeat();
          }
        }
      });

      return messages;
    },

    commit: async () => {
      await consumer.commitOffsets();
    },

    disconnect: async () => {
      await consumer.disconnect();
    }
  };
};

/**
 * Create a Kafka producer
 * @param {Object} config - { brokers, clientId }
 * @returns {Promise<Object>} Producer object
 */
exports.createProducer = (config) => async () => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers
  });

  const producer = kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 30000,
  });

  await producer.connect();

  return {
    send: (topic, message) => async () => {
      await producer.send({
        topic,
        messages: [{
          key: message.key,
          value: message.value,
          headers: message.headers,
          timestamp: message.timestamp
        }]
      });
    },

    sendBatch: (topic, messages) => async () => {
      await producer.send({
        topic,
        messages: messages.map(msg => ({
          key: msg.key,
          value: msg.value,
          headers: msg.headers,
          timestamp: msg.timestamp
        }))
      });
    },

    disconnect: async () => {
      await producer.disconnect();
    }
  };
};

/**
 * Example: Create transactional producer for exactly-once semantics
 */
exports.createTransactionalProducer = (config) => async () => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers
  });

  const producer = kafka.producer({
    transactionalId: config.transactionalId,
    maxInFlightRequests: 1,
    idempotent: true
  });

  await producer.connect();

  return {
    sendTransactional: (topic, messages, consumerOffsets) => async () => {
      const transaction = await producer.transaction();
      
      try {
        await transaction.send({
          topic,
          messages: messages.map(msg => ({
            key: msg.key,
            value: msg.value
          }))
        });

        if (consumerOffsets) {
          await transaction.sendOffsets({
            consumerGroupId: consumerOffsets.groupId,
            topics: consumerOffsets.topics
          });
        }

        await transaction.commit();
      } catch (e) {
        await transaction.abort();
        throw e;
      }
    },

    disconnect: async () => {
      await producer.disconnect();
    }
  };
};

/**
 * Example: Admin client for topic management
 */
exports.createAdmin = (config) => async () => {
  const kafka = new Kafka({
    clientId: config.clientId,
    brokers: config.brokers
  });

  const admin = kafka.admin();
  await admin.connect();

  return {
    createTopic: (topic, numPartitions, replicationFactor) => async () => {
      await admin.createTopics({
        topics: [{
          topic,
          numPartitions: numPartitions || 1,
          replicationFactor: replicationFactor || 1
        }]
      });
    },

    deleteTopic: (topic) => async () => {
      await admin.deleteTopics({
        topics: [topic]
      });
    },

    listTopics: async () => {
      return await admin.listTopics();
    },

    disconnect: async () => {
      await admin.disconnect();
    }
  };
};

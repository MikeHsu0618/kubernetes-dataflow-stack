package main

import (
	"fmt"
	"github.com/Shopify/sarama"
	"sync"
)

func main() {
	config := sarama.NewConfig()
	config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin
	consumer, err := sarama.NewConsumer([]string{"localhost:9093"}, config)
	if err != nil {
		panic(err)
	}
	defer func() {
		if err := consumer.Close(); err != nil {
			panic(err)
		}
	}()

	topic := "my_topic"
	partitions, err := consumer.Partitions(topic)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%#v", partitions)
	var wg sync.WaitGroup
	for _, partition := range partitions {
		wg.Add(1)
		go func(partition int32) {
			defer wg.Done()

			partitionConsumer, err := consumer.ConsumePartition(topic, 2, sarama.OffsetNewest)
			if err != nil {
				panic(err)
			}
			defer func() {
				if err := partitionConsumer.Close(); err != nil {
					panic(err)
				}
			}()

			for message := range partitionConsumer.Messages() {
				fmt.Printf("Received message with offset %d from partition %d: %s = %s\n", message.Offset, message.Partition, string(message.Key), string(message.Value))
			}
		}(partition)
	}

	wg.Wait()
}

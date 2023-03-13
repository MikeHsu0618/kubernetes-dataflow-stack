package main

import (
	"fmt"
	"time"

	"github.com/Shopify/sarama"
)

func main() {
	// 建立 kafka 生產者設定
	config := sarama.NewConfig()
	config.Producer.Return.Successes = true

	// 建立 kafka 生產者
	producer, err := sarama.NewSyncProducer([]string{"localhost:9093"}, config)
	if err != nil {
		panic(err)
	}
	defer producer.Close()

	// 要寫入的資料
	message := &sarama.ProducerMessage{
		Topic: "my_topic",
		Key:   sarama.StringEncoder("my_key"),
		Value: sarama.StringEncoder("my_value"),
	}

	// 設定要寫入的分區
	partitions := []int32{0, 1, 2}

	for {
		// 寫入資料到指定分區
		for _, partition := range partitions {
			message.Partition = partition
			_, _, err := producer.SendMessage(message)
			if err != nil {
				fmt.Printf("Failed to send message: %v\n", err)
			} else {
				fmt.Printf("Message sent to partition %d\n", partition)
			}
		}

		time.Sleep(1 * time.Millisecond)
	}
}

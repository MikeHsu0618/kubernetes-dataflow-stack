Handle Kafka Rebalance:
```
kubectl annotate kafkarebalance my-rebalance strimzi.io/rebalance=approve -n myproject

kubectl annotate kafkarebalance my-rebalance strimzi.io/rebalance=refresh -n myproject

kubectl annotate kafkarebalance my-rebalance strimzi.io/rebalance=stop -n myproject
```
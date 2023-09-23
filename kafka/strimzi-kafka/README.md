Handle Kafka Rebalance:
```
kubectl annotate kafkarebalance kafka-rebalance strimzi.io/rebalance=approve -n myproject

kubectl annotate kafkarebalance kafka-rebalance strimzi.io/rebalance=refresh -n myproject

kubectl annotate kafkarebalance kafka-rebalance strimzi.io/rebalance=stop -n myproject
```

Support Goal list:
```
Supported: 
        CpuCapacityGoal, CpuUsageDistributionGoal,
        DiskCapacityGoal, DiskUsageDistributionGoal,
        IntraBrokerDiskCapacityGoal, IntraBrokerDiskUsageDistributionGoal,
        LeaderBytesInDistributionGoal, LeaderReplicaDistributionGoal,
        MinTopicLeadersPerBrokerGoal, NetworkInboundCapacityGoal,
        NetworkInboundUsageDistributionGoal, NetworkOutboundCapacityGoal,
        NetworkOutboundUsageDistributionGoal, PotentialNwOutGoal,
        PreferredLeaderElectionGoal, RackAwareGoal, ReplicaCapacityGoal,
        ReplicaDistributionGoal, TopicReplicaDistributionGoal
```
```
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
```

```
helm upgrade --install grafana-agent-operator grafana/grafana-agent-operator -n monitoring --create-namespace
```
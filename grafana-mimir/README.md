helm install:
```
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

helm upgrade --install mimir grafana/mimir-distributed -f values.yaml -n monitoring --create-namespace
```
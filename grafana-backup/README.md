```
docker run --user $(id -u):$(id -g) --rm --name grafana-backup-tool \                                                                     (orbstack/default)
           -e GRAFANA_TOKEN=<GRAFANA_TOKEN> \
           -e GRAFANA_URL=<GRAFANA_TOKEN> \
           -e GRAFANA_ADMIN_ACCOUNT=admin \
           -e GRAFANA_ADMIN_PASSWORD=<GRAFANA_ADMIN_PASSWORD> \
           -v ./backup:/opt/grafana-backup-tool/_OUTPUT_  \
           ysde/docker-grafana-backup-tool grafana-backup save --components=dashboards
```

```
docker run --user $(id -u):$(id -g) --rm --name grafana-backup-tool \
           -e GRAFANA_TOKEN=<GRAFANA_TOKEN> \
           -e GRAFANA_URL=<GRAFANA_TOKEN> \
           -e GRAFANA_ADMIN_ACCOUNT=admin \
           -e GRAFANA_ADMIN_PASSWORD=<GRAFANA_ADMIN_PASSWORD> \
           -v ./backup:/opt/grafana-backup-tool/_OUTPUT_  \
           ysde/docker-grafana-backup-tool grafana-backup restore /opt/grafana-backup-tool/_OUTPUT_/202408311406.tar.gz
```

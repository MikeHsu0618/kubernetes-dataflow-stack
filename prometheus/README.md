
Installation:
```
helm install prome prometheus-community/kube-prometheus-stack --values=prometheus-values.yaml
```

重要參數：
```


## Manages Prometheus and Alertmanager components
## for issue: Cannot upgrade after rules change ("prometheusrulemutate.monitoring.coreos.com": the server could not find the requested resource)
## https://github.com/helm/charts/issues/17766, https://lyz-code.github.io/blue-book/devops/prometheus/prometheus_troubleshooting/
prometheusOperator:
  tls:
    enabled: false
  admissionWebhooks:
    enabled: false
    patch:
      enabled: false
    
    ## 取消 match labal 需要新增 release: <release name> 才能發現到 Service/Pod Monitor
    ruleSelectorNilUsesHelmValues: false
    serviceMonitorSelectorNilUsesHelmValues: false
    podMonitorSelectorNilUsesHelmValues: false
    probeSelectorNilUsesHelmValues: false
    service:
      ruleSelectorNilUsesHelmValues: false
      
prometheus:
  ingress:
    enabled: true
    # For Kubernetes >= 1.18 you should specify the ingress-controller via the field ingressClassName
    # See https://kubernetes.io/blog/2020/04/02/improvements-to-the-ingress-api-in-kubernetes-1.18/#specifying-the-class-of-an-ingress
    ingressClassName: nginx
    hosts: ["prometheus.domain.com"]
    ## Paths to use for ingress rules - one path should match the prometheusSpec.routePrefix
    ##
    paths: ["/"]
    # 手動添加 ScrapreConfigs (通常可以使用服務內建的 Service/Pod Monitor)
    additionalScrapeConfigs: []
#      - job_name: 'vector'
#        scrape_interval: 1s
#        static_configs:
#          - targets: [ 'vector.default:9090' ]

Grafana:
  defaultDashboardsTimezone: Asia/Taipei
  adminPassword: admin
  ingress:
    enabled: true
  ingressClassName: nginx
    hosts: ["grafana.domain.com"]
    path: /
  grafana.ini:
    #viewer can edit dashboard but not save 
    users:
      viewers_can_edit: true
    # make querier max query time to 5m
    dataproxy:
      timeout: 300

# 如果在本地 Docker-Desktop 需要將 hostRootFsMount 關閉才能啟動 prometheus-node-exporter
## Deploy node exporter as a daemonset to all nodes
##
  nodeExporter:
    enabled: true
    hostRootfs: false

## Configuration for prometheus-node-exporter subchart
##
prometheus-node-exporter:
  hostRootFsMount:
    enabled: false
```
Grafana install:
```
helm upgrade --install grafana  grafana/grafana -n grafana --create-namespace -f values.yaml
```

google oauth2 authentication for grafana:
```
  grafana.ini:
    auth.google:
      enabled: true
      allow_sign_up: true
      # 允許的 gmail domains
      allowed_domains: example.com example.net
      client_id: <gcp credentails client_id>
      client_secret: <gcp credentails client_secret>
      # 使 oauth 登入用戶權限可被 admin 調整
      role_attribute_path: ""
      auth_url: https://accounts.google.com/o/oauth2/auth
      scopes: https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email
      token_url: https://accounts.google.com/o/oauth2/token
    server:
      domain: '{{ if (and .Values.ingress.enabled .Values.ingress.hosts) }}{{ .Values.ingress.hosts
        | first }}{{ else }}''''{{ end }}'
      # 需設定給 oauth2 redirect url (注意結尾的 /)
      root_url: https://gfa.example.co/
```

grafana ingress:
```
  ingress:
    annotations: {}
    enabled: true
    extraPaths: []
    hosts:
    - gfa.example.co
    labels: {}
    path: /
    pathType: Prefix
    tls:
    - hosts:
      - gfa.example.co
      secretName: example-co-wild
```

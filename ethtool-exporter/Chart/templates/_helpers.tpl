{{- define "ethtool-exporter.resources" -}}
{{- if .Values.resources }}
{{- toYaml .Values.resources | nindent 12 }}
{{- else }}
limits:
  cpu: 250m
  memory: 100Mi
requests:
  cpu: 10m
  memory: 50Mi
{{- end }}
{{- end }}

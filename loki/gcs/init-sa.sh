export ENVIRONMENT=prod
export PROJECT=fresh-rampart-377713
export CLUSTER=devops
export BUCKET_NAME=$ENVIRONMENT-$CLUSTER-loki-bucket
export SA_NAME=loki-logging
export NS=infra
export SA=${SA_NAME}@${PROJECT}.iam.gserviceaccount.com
export LOCATION=asia-east1

gsutil mb -b on -l ${LOCATION} -p ${PROJECT} gs://${BUCKET_NAME}/

gcloud iam service-accounts create ${SA_NAME} --project ${PROJECT} --display-name="Service account for Loki"

gcloud projects add-iam-policy-binding ${PROJECT} \
    --member="serviceAccount:${SA_NAME}@${PROJECT}.iam.gserviceaccount.com" \
    --project ${PROJECT} \
    --role="roles/storage.objectAdmin"

gcloud iam service-accounts add-iam-policy-binding --project ${PROJECT} ${SA} \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:$PROJECT.svc.id.goog[logging/loki]"

gcloud iam service-accounts keys create ${SA_NAME}-sa.json --iam-account=${SA}

kubectl create secret generic ${SA_NAME}-sa --from-file=gcp-sa-file=${SA_NAME}-sa.json -n ${NS}

helm upgrade --install loki grafana/loki-distributed \
-f ./loki.yaml \
--set customParams.gcsBucket=${BUCKET_NAME} \
--version 0.67.1 \
--namespace ${NS}

helm upgrade --install \
--namespace ${NS} \
--set "loki.serviceName=loki-query-frontend" \
--set "config.clients[0].url=http://loki-gateway/loki/api/v1/push" \
promtail grafana/promtail
export ENVIRONMENT=prod
export PROJECT=fresh-rampart-377713
export CLUSTER=devops
export SA_NAME=loki-logging
export BUCKET_NAME=$ENVIRONMENT-$CLUSTER-${SA_NAME}-bucket
export NS=infra
export SA=${SA_NAME}@${PROJECT}.iam.gserviceaccount.com
export LOCATION=asia-east1

# create logging bucket
gsutil mb -b on -l ${LOCATION} -p ${PROJECT} gs://${BUCKET_NAME}/

# create service account
gcloud iam service-accounts create ${SA_NAME} --project ${PROJECT} --display-name="Service account for Loki"

# add service account to project
gcloud projects add-iam-policy-binding ${PROJECT} \
    --member="serviceAccount:${SA_NAME}@${PROJECT}.iam.gserviceaccount.com" \
    --project ${PROJECT} \
    --role="roles/storage.objectAdmin" \
    --condition="resource.name.startsWith('projects/_/buckets/${BUCKET_NAME}')"

# add service account to cluster
gcloud iam service-accounts keys create ${SA_NAME}-sa.json --iam-account=${SA}

# create kubernetes secret
kubectl create secret generic ${SA_NAME}-sa --from-file=gcp-sa-file=${SA_NAME}-sa.json -n ${NS}

# install loki-distributed
helm upgrade --install loki grafana/loki-distributed \
-f ./loki.yaml \
--set customParams.gcsBucket=${BUCKET_NAME} \
--version 0.67.1 \
--namespace ${NS}

# install promtail
helm upgrade --install \
--namespace ${NS} \
--set "loki.serviceName=loki-query-frontend" \
--set "config.clients[0].url=http://loki-gateway/loki/api/v1/push" \
promtail grafana/promtail
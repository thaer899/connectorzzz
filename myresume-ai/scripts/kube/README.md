kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/prometheus-engine/v0.7.4/manifests/setup.yaml

kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/prometheus-engine/v0.7.4/manifests/operator.yaml

kubectl -n default apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/prometheus-engine/v0.7.4/examples/example-app.yaml

kubectl -n default apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/prometheus-engine/v0.7.4/examples/pod-monitoring.yaml

gcloud config set project thaersaidi-da79c

gcloud iam service-accounts create gmp-test-sa

gcloud projects add-iam-policy-binding thaersaidi-da79c\
 --member=serviceAccount:gmp-test-sa@thaersaidi-da79c.iam.gserviceaccount.com \
 --role=roles/monitoring.metricWriter

gcloud iam service-accounts keys create gmp-test-sa-key.json \
 --iam-account=gmp-test-sa@thaersaidi-da79c.iam.gserviceaccount.com

kubectl -n gmp-public create secret generic gmp-test-sa \
 --from-file=key.json=gmp-test-sa-key.json

kubectl -n gmp-public edit operatorconfig config

Add this:
collection:
credentials:
name: gmp-test-sa
key: key.json

---

kubectl -n gmp-public edit operatorconfig config

    apiVersion: monitoring.googleapis.com/v1
    kind: OperatorConfig
    metadata:
      namespace: gmp-public
      name: config
    features:
      targetStatus:
        enabled: true

kubectl -n default describe podmonitorings/prom-example

---

For example, the following metric relabeling rule will filter out any metric that begins with foo*bar*, foo*baz*, or foo*qux*:

metricRelabeling:

- action: drop
  regex: foo*(bar|baz|qux)*.+
  sourceLabels: [__name__]

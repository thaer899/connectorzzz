gcloud services enable iamcredentials.googleapis.com \
  --project "thaersaidi-da79c"

gcloud iam workload-identity-pools create github-actions \
    --location="global" \
    --description="GitHub Actions MyResume" \
    --display-name="GitHub Actions MyResume"


gcloud iam workload-identity-pools providers create-oidc github-actions-oidc \
    --location="global" \
    --workload-identity-pool=github-actions \
    --issuer-uri="https://token.actions.githubusercontent.com/" \
    --attribute-mapping="google.subject=assertion.sub"


gcloud iam service-accounts create thaersaidi-sa \
    --display-name="thaersaidi-sa" \
    --description="thaersaidi-sa" \
    --project=thaersaidi-da79c


export REPO="thaersaidi.net"

gcloud iam service-accounts add-iam-policy-binding "thaersaidi-sa@thaersaidi-da79c.iam.gserviceaccount.com" \
  --project="thaersaidi-da79c" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/github-actions-oidc/attribute.repository/thaersaidi.net"


gcloud projects add-iam-policy-binding thaersaidi-da79c \
    --member="serviceAccount:thaersaidi-sa@thaersaidi-da79c.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountTokenCreator"


gcloud iam service-accounts add-iam-policy-binding \
  thaersaidi-sa@thaersaidi-da79c.iam.gserviceaccount.com \
    --member="serviceAccount:thaersaidi-sa@thaersaidi-da79c.iam.gserviceaccount.com" \
  --role="roles/editor" \
  --project=thaersaidi-da79c

gcloud iam service-accounts add-iam-policy-binding \
  thaersaidi-sa@thaersaidi-da79c.iam.gserviceaccount.com \
    --member="serviceAccount:thaersaidi-sa@thaersaidi-da79c.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccounts.getAccessToken" \
  --project=thaersaidi-da79c

gcloud iam workload-identity-pools providers describe "github-actions-oidc" \
  --project="thaersaidi-da79c" \
  --location="global" \
  --workload-identity-pool="github-actions-oidc" \
  --format="value(name)"


gcloud config set auth/impersonate_service_account thaersaidi-sa@thaersaidi-da79c.iam.gserviceaccount.com

gcloud iam service-accounts list --project=thaersaidi-da79c

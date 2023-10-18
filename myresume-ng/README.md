
gcloud auth application-default login
gcloud auth application-default set-quota-project thaersaidi-da79c

cd utils/gcp/hosting/update-single-file

cd myresume-ng/public/
update-single-file --project my-app team/about.html






gh api \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  repos/thaer899/myresume-ng/actions/secrets/AZURE_STATIC_WEB_APPS_API_TOKEN_JOLLY_WAVE_04CA68203


  $ gh secret set -f .env --repo target-owner/target-repo

$ npm install -g source-map-explorer
$ ng build --source-map
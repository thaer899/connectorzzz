// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  mainEmail: "rebel.saidi.thaer@gmail.com",
  myResumeURL: 'http://localhost:4000/myresume',
  myAgentsURL: 'http://localhost:33000/autogen',
  myAgentsWS: 'ws://localhost:33000/autogen',
  agentFlowURL: 'http://localhost:33000/agentflow',
  agentFlowWS: 'ws://localhost:33000/agentflow',
  functionApiKey: 'FJxJ2MRv4vtAH0Js81Q390',
  title: "Site Generator",
  firebaseConfig: {
    apiKey: "AIzaSyA2wXas1gdmAzamuvI2gFM_spA28ASUzLA",
    authDomain: "site-generator-ng.firebaseapp.com",
    projectId: "site-generator-ng",
    storageBucket: "site-generator-ng.appspot.com",
    messagingSenderId: "484329035762",
    appId: "1:484329035762:web:f9aeb62e2f8d83a0c03d6b"
  }


};

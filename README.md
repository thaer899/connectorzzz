[![myresume-ng](https://github.com/thaer899/thaersaidi.net/actions/workflows/myresume-ng.yml/badge.svg?branch=master)](https://github.com/thaer899/thaersaidi.net/actions/workflows/myresume-ng.yml)
[![site-generator-ng](https://github.com/thaer899/thaersaidi.net/actions/workflows/site-generator-ng.yml/badge.svg?branch=master)](https://github.com/thaer899/thaersaidi.net/actions/workflows/site-generator-ng.yml)
[![myresume-ai-automate](https://github.com/thaer899/thaersaidi.net/actions/workflows/myresume-ai-automate.yml/badge.svg?branch=master)](https://github.com/thaer899/thaersaidi.net/actions/workflows/myresume-ai-automate.yml)

### MyResume Project

This repository serves as the nucleus of an ensemble of projects and utilities.
Engineered with precision for crafting and deploying top-notch applications.

The project is exposed across multiple domains and subdomains:

- 🌎 Resume UI: [`thaersaidi.net`](https://thaersaidi.net)
- 🛠️ Dashboard: [`console.thaersaidi.net`](https://console.thaersaidi.net)
- 🧠 AI Utilities: [`ai.thaersaidi.net`](https://ai.thaersaidi.net)

The architecture is methodically structured.
Facilitating a streamlined workflow for managing the diverse project facets.
Encompassing backend services, front-end applications, and adept cloud resource orchestration.

#

### Diagram:

```mermaid
%%{init: {'theme': 'default'}}%%
classDiagram
    class DB {
        Firebase Bucket
        --
        -Profiles()
        -Users()
        -Bots()
    }
    class ResumeUI {
        myresume-ng: Angular App
        --
        -User Resume()
        -User Bots()
    }
    class Dashboard {
        site-generator-ng: Angular App
        --
        -CRUD Resume UI()
        -User Bots UI()
        -MyAgents UI()
        -AgentFlow UI()
    }
    class MyResumeExpress {
        NodeBackend: ExpressJS Service
        --
        -User Bots()
    }
    class MyAgentsPy {
        PythonBackend: FastAPI Service
        --
        -Autogen API()
    }
    class AgentFowPy {
        PythonBackend: FastAPI Service
        --
        -AgentFlow API()
        -AgentFlow WS()
    }
    class OpenAI_LLM {
        AI Platform()
        --
    }

    %% Connections
    ResumeUI --> DB :  (R)
    Dashboard --> DB :  (W/R)
    ResumeUI --> MyResumeExpress : (API)
    MyResumeExpress --> DB :  (R)
    MyResumeExpress --> OpenAI_LLM : (API)
    Dashboard --> MyAgentsPy :  (WS)
    MyAgentsPy --> OpenAI_LLM : (API)
    Dashboard --> AgentFowPy :  (WS)
    AgentFowPy --> OpenAI_LLM : (API)


```

#

---

<details>
<summary>📂 Project Highlights</summary>

- **Summary**: Intelligent solutions.
- **Backend**: Backend services to interact with database and enhance UIs.
- **Frontend**: Front-end using angular applications for a resume exposure.
- **Admin Console**: Administrative console configurable using angular for UI and BOT management and orchestration.
- **AI**: A suite of tools and components to interact with AI models.
- **Utils**: A suite of tools for automating and streamlining various aspects of the project.
- **CI/CD**: Automation pipelines for all aspects of the project.
</details>

---

### Workflows:

🔄 [CI/CD Pipelines ](https://github.com/thaer899/thaersaidi.net/tree/master/.github/workflows/): Automating and optimizing the development workflow through Continuous Integration and Continuous Deployment pipelines.

---

### Apps:

🖥️ [myresume-ng ](https://github.com/thaer899/thaersaidi.net/tree/master/myresume-ng):
Angular-based application showcasing my professional journey and skill set.

🌐 [site-generator-ng ](https://github.com/thaer899/thaersaidi.net/tree/master/site-generator-ng):
A dynamic site generator engineered with Angular, facilitating seamless site creation and management.

🛠️ [myresume-express ](https://github.com/thaer899/thaersaidi.net/tree/master/myresume-express):
ExpressJS powered backend service, designed to deliver robust support for my online resume portal.

🛠️ [myresume-express ](https://github.com/thaer899/thaersaidi.net/tree/master/myresume-express):
ExpressJS powered backend service, designed to deliver robust support for my online resume portal.

🧠 [myresume-ai ](https://github.com/thaer899/thaersaidi.net/tree/master/myresume-ai):
A suite of tools and components to interact with Kubernetes cluster and AI models.

🧰 [myresume-utils ](https://github.com/thaer899/thaersaidi.net/tree/master/myresume-utils):
A collection of utility tools and libraries enhancing development and operational efficiencies.

#

### Project Structure

```plaintext
\---thaersaidi.net
    +---.github
    |   \---workflows
    +---myresume-ai
    |   \---src
    +---myresume-express
    |   \---src
    +---myresume-ng
    |   +---e2e
    |   +---src
    |   \---tests
    +---myresume-utils
    |   \---utils
    +---site-generator-ng
    |   +---.firebase
    |   +---e2e
    |   \---src
    \---utils
        +---azure
        +---gcp
        \---helm
            +---myresume-ai
                +---apps
                |   +---myresume-express
                +---common
        \---hugging_face
            +---automator
            +---myresume
            +---t5
        \---misc
        \---multi_task

```

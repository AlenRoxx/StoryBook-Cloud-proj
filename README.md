# AI-Powered Interactive Storybook Generator 📚✨

An automated, full-stack application that leverages local Large Language Models (LLMs) and Latent Diffusion Models to generate highly creative, 5-page children's storybooks complete with contextual, high-quality illustrations in under a minute.

---

## 🚀 Architectural Overview
The system utilizes a hybrid infrastructure designed to maximize consumer-grade hardware (specifically optimized for mobile workstation GPUs like the NVIDIA RTX 3050 Laptop GPU):
*   **Frontend UI:** Cloud-hosted React application deployed on DigitalOcean App Platform.
*   **Orchestration Backend:** Express.js proxy server serving production traffic over a secure **Cloudflare Tunnel (Argo Tunnel)**.
*   **Local Inference Engines:** Ollama Engine (Text generation) and Stable Diffusion WebUI API (Image generation) running locally to harness hardware acceleration natively.

---

## 🤖 AI Models & Dependencies

### 1. Core AI Models

| Model Family | Specific Variant | Source / Provider | Architecture / Parameters | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Qwen 2.5** | `Qwen2.5-1.5B-Instruct` | Alibaba / Hugging Face | 1.54 Billion Parameters (GGUF Q4_K_M) | Real-time structured story generation & complex image prompt generation in under 15 seconds. |
| **Stable Diffusion v1.5** | `v1-5-pruned-emaonly` | RunwayML / Hugging Face | 860 Million Parameters (`.safetensors`) | Contextual story illustration generation in 5 seconds per frame. |

### 2. Core Dependencies
*   **Frontend:** React (v18+), Axios / Native Fetch API.
*   **Backend Runtime:** Node.js (v18+), Express.js, CORS middleware, `node-fetch`.
*   **Local Infrastructure:** 
    *   [Ollama Engine](https://ollama.com/) (v0.18+)
    *   [AUTOMATIC1111 Stable Diffusion WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui) (v1.10+)
    *   [Cloudflare `cloudflared` CLI](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/install-and-setup/tunnel-guide/local/)

---

## 💻 Hardware Requirements (Optimized Baseline)
This project is engineered to work smoothly on consumer gaming laptops with the following minimum specifications:
*   **GPU:** NVIDIA GeForce RTX 3050 Laptop GPU (4.0 GiB VRAM)
*   **System RAM:** 16 GB DDR4/DDR5
*   **CUDA Architecture:** Compute Capability 8.6+ (Driver version 12.x+)

---

## 🛠️ Step-by-Step Local Setup Guide

Follow these instructions to mirror the local production environment.

### Prerequisites: Clone the Repository
```bash
git clone [https://github.com/AlenRoxx/StoryBook-Cloud-proj.git](https://github.com/AlenRoxx/StoryBook-Cloud-proj.git)
cd "Story Book Project".

```
### Phase 1: Local Text Inference Engine (Ollama)
Download and install Ollama for Windows.

Open your terminal and pull the optimized Qwen model:
```bash
ollama pull qwen2.5:1.5b

```

Initialize the model service to verify GPU VRAM layer allocation (29/29 layers offloaded):
```bash
ollama serve

```

### Phase 2: Local Vision Inference Engine (Stable Diffusion)
Install Python 3.10.6 and add it to your Windows PATH environment variables.

Install Git.

Navigate into the vision folder, and download the base weights (v1-5-pruned-emaonly.safetensors) from Hugging Face into stable-diffusion-webui/models/Stable-diffusion/.

Open and modify webui-user.bat to include the highly crucial low-VRAM optimizations:

```bash
set COMMANDLINE_ARGS=--api --listen --xformers --medvram --cors-allow-origins [https://plotfor.me](https://plotfor.me)

```

Run webui-user.bat to download internal torch/xformers binaries and spin up the API instance on http://127.0.0.1:7860.

### Phase 3: Setup the Cloudflare Tunnel
Download the cloudflared executable tool.

Expose your backend network layer safely to the web by executing:
```bash
cloudflared tunnel --url http://localhost:3001

```

Copy the generated public cloudflare forwarding URL (e.g., https://*.trycloudflare.com) for deployment configuration.

### Phase 4: Configure & Start Orchestration Server
Navigate to your backend cluster directory:
```bash
cd storybook-backend
npm install

```


Configure your Environment Variables or verify fallback mappings inside server.js.

Boot up the service layer:
```bash
npm start

```


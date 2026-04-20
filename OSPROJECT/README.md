# CPU Scheduling Simulator

An interactive, visually stunning CPU Scheduling Simulator built for the **Operating Systems Lab**. Simulate and visualize how different CPU scheduling algorithms manage process execution in real time.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

---

## ✨ Features

- **6 Scheduling Algorithms**
  - **FCFS** — First Come First Served
  - **SJF** — Shortest Job First (Non-Preemptive)
  - **SRTF** — Shortest Remaining Time First (Preemptive SJF)
  - **Round Robin** — Time-quantum based scheduling
  - **Priority (Non-Preemptive)**
  - **Priority (Preemptive)**

- **Visual Gantt Chart** — SVG-based timeline with color-coded process bars
- **Performance Metrics** — Average Waiting Time, Turnaround Time, Response Time, CPU Utilization, Throughput
- **Per-Process Details Table** — Completion, Turnaround, Waiting & Response times with best/worst highlighting
- **3D Animated Background** — Immersive Three.js scene with particles, wireframe geometries, and mouse parallax
- **Auto-fill Demo Data** — Quickly populate process inputs for testing
- **Support for up to 20 processes**

---

## 🚀 Getting Started

### Prerequisites

No build tools or dependencies required — this is a pure static website.

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/cpu-scheduling-simulator.git
   cd cpu-scheduling-simulator
   ```

2. **Open in browser**

   Simply open `index.html` in any modern browser:
   ```bash
   open index.html        # macOS
   xdg-open index.html    # Linux
   start index.html       # Windows
   ```

   Or use a local dev server (recommended for best experience):
   ```bash
   # Using Python
   python3 -m http.server 8000

   # Using Node.js
   npx serve .
   ```
   Then visit `http://localhost:8000`

---

## 📁 Project Structure

```
cpu-scheduling-simulator/
├── index.html          # Main HTML page
├── css/
│   └── style.css       # All styles (variables, layout, components, animations)
├── js/
│   ├── background.js   # Three.js 3D animated background
│   ├── scheduler.js    # Scheduling algorithm implementations & metrics
│   └── app.js          # UI logic, rendering, and simulation orchestration
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🎮 How to Use

1. **Select an Algorithm** — Click one of the 6 algorithm buttons
2. **Set Process Count** — Enter a number (1–20) and click **GENERATE**
3. **Enter Process Details** — Fill in Arrival Time, Burst Time, and Priority for each process (or click **Auto-fill Demo**)
4. **Execute Simulation** — Click the run button to see results
5. **View Results** — Scroll down to see the Gantt chart, performance metrics, and detailed process table

---

## 🛠 Technologies Used

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, animations, glassmorphism effects |
| **JavaScript (ES6+)** | Scheduling algorithms, DOM manipulation, rendering |
| **Three.js** | 3D animated background (stars, particles, wireframes) |
| **Google Fonts** | Orbitron, Rajdhani, JetBrains Mono typography |

---

## 📊 Algorithms Overview

| Algorithm | Type | Key Characteristic |
|---|---|---|
| FCFS | Non-Preemptive | Processes run in arrival order |
| SJF | Non-Preemptive | Shortest burst time runs first |
| SRTF | Preemptive | Remaining time compared at each unit |
| Round Robin | Preemptive | Fixed time quantum per turn |
| Priority | Non-Preemptive | Lowest priority number runs first |
| Priority (P) | Preemptive | Higher priority preempts running process |

---

## 🌐 Deploy on GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose `main` branch and `/ (root)` folder
5. Click **Save** — your site will be live at `https://<your-username>.github.io/<repo-name>/`

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>CPU Scheduling Simulator</b> · Operating Systems Lab · v3.0
</p>

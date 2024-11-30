# Visualizing Data from OVDinfo API
This project aims to make the invaluable data from OVDinfo API more accessible and easy to understand for everyone. One of the key features is the Correctional Cartography map, which provides insights into the movement of individuals resulting from incarceration. The Sentences graph tracks the evolution of prison sentences over time, and the radial diagram focuses on the most common articles leading to political convictions. These visualizations were created using D3.js and Observable Plot. 3D models are made in Blender.
Find the project at https://kseniiia.nl/ovd/ 

## Features

### 1. **Correctional Cartography Map**
   - Visualizes the movement of individuals resulting from incarceration.
   - Offers insights into geographical trends and incarceration hotspots.

### 2. **Sentences Graph**
   - Tracks the evolution of prison sentences over time.
   - Helps users understand sentencing trends and changes.

### 3. **Radial Diagram**
   - Focuses on the most common articles leading to political convictions.
   - Makes it easier to analyze the frequency of specific legal articles.

### 4. **3D Models**
   - Developed using Blender.

---

## Technologies Used

- **Frontend Framework:** Vue.js
- **Data Visualization Libraries:** 
  - D3.js
  - Observable Plot
  - Chart.js
- **3D Modeling:** Blender
- **State Management:** Vuex
- **Routing:** Vue Router
- **API Interaction:** Axios

---

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Shandaram/prison-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd prison-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run serve
   ```
5. Open your browser and visit:
   ```
   http://localhost:8080
   ```

---

## Project Structure

```
prison-app/
├── src/
│   ├── components/      # Vue components for visualizations
│   ├── assets/          # Images, 3D models, and other static assets
│   ├── views/           # Pages and main application views
│   ├── store/           # Vuex state management
│   ├── router.js        # Vue Router configuration
│   └── main.js          # Entry point of the app
├── public/
│   └── index.html       # Main HTML template
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

---

## Scripts

| Script         | Description                              |
|----------------|------------------------------------------|
| `npm run serve` | Starts the development server.           |
| `npm run build` | Builds the project for production.       |
| `npm run lint`  | Lints and fixes project files.           |

---

## Acknowledgments

- **OVDinfo API** for collecting and sharing crucial data about political convictions in Russia.

---

- Created for Interactive Digital Media MSc at Trinity College Dublin

# CheckCars Dashboard

CheckCars Dashboard is a React-based web application that connects to the CheckCars API to fetch data about vehicle reports—including departures, breakdowns, and collisions. The app features JWT-based user authentication and provides a clean, responsive interface to view and manage records in real time.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **JWT Authentication:** Secure user authentication to protect access to sensitive data.
- **Real-Time Data:** Connects to the CheckCars API for live updates on vehicle reports.
- **Record Listing:** A user-friendly interface to view and manage vehicle records.
- **Interactive Maps:** Integration with Leaflet and React-Leaflet to display geolocated information.
- **Responsive Design:** Built with Tailwind CSS ensuring a modern and responsive UI.
- **Notifications & PDF Export:** Utilizes react-toastify for alerts and jsPDF for report exports.
- **Real-Time Communication:** Leverages @microsoft/signalr for real-time updates.

## Technologies

This project is built using:

- **React** for the front-end framework.
- **Vite** as the build tool for fast development and optimized production builds.
- **Tailwind CSS** for styling.
- **React Router DOM** for routing.
- **JWT** for secure authentication.
- **Additional Packages:**
  - `@microsoft/signalr`
  - `@tailwindcss/vite`
  - `jspdf`
  - `leaflet` and `react-leaflet`
  - `react-icons`
  - `react-spinners`
  - `react-toastify`

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/stevengazo/checkcars-web.git
   cd checkcars-dashboard

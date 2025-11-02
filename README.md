# 🛒 TrackHub Client

TrackHub Client is the frontend of the TrackHub marketplace project, built using **Angular 20**. The application is designed with a **responsive layout**, ensuring an optimal experience on desktop, tablet, and mobile devices.

---

## 🌟 Features

* **Modern Angular 20 frontend** with modular architecture
* Fully **responsive design** using TailwindCSS and custom styles
* Dynamic **category and subcategory menus** for easy navigation
* Integration with backend APIs for product listing and filtering
* Interactive UI elements with hover effects and animations
* Clean and maintainable code structure

---

## 🖥️ Screenshots

*(You can add screenshots here to showcase the responsive design and UI)*
(public/Screenshot1.png)

---

## 🚀 Getting Started

### Prerequisites

* Node.js >= 20.x
* Angular CLI >= 20.x

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/TrackHub-Client.git](https://github.com/your-username/TrackHub-Client.git)
    ```
2.  Navigate to the project folder:
    ```bash
    cd TrackHub-Client
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    ng serve
    ```
5.  Open your browser and go to:
    ```
    http://localhost:4200
    ```

---

## ⚙️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Angular 20** | Core JavaScript Framework |
| **TypeScript** | Language for type safety and scalability |
| **TailwindCSS** | Utility-first CSS framework for responsive design |
| **HTML5 & CSS3** | Markup and Styling |
| **RxJS** | Optional: Reactive programming for handling asynchronous data streams |
| **REST APIs** | Integration with TrackHub backend services |

---

## 💻 Common Commands

| Command | Description |
| :--- | :--- |
| `ng serve --open` | Serves the application and opens a new browser window. |
| `ng test` | Executes the unit tests via [Karma](https://karma-runner.github.io). |
| `ng test --code-coverage` | Runs tests and generates a code coverage report. |
| `ng generate c <name>` | Generates a new component (e.g., `ng g c products/list`). |

---

## 📦 Deployment

To build the project for a production environment, use the Angular CLI's build command. This will compile and optimize the application into static files ready for any web server.

```bash
ng build --configuration production

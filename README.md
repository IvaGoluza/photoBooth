# PhotoBooth App
#### Enrich your party with a digital PhotoBooth.
## Project Overview
PhotoBooth is a Progressive Web App (PWA) designed for creating and joining parties, capturing memories, and saving images using the device's native camera functionality. It offers offline capabilities, graceful degradation for devices without camera support, and utilizes Firebase services for database operations.

## Functionality
The main functionalities of the app include:
- **Create a New Party:** Generate a unique party key to invite friends and start capturing memories.
- **Join Party:** Enter a party key to join an existing event and save memories using PhotoBooth.
  
## Features
- **Installable PWA:** Users can install the app on their devices for quick access and an app-like experience.
- **Caching and Offline Support:** Utilizes caching strategies to ensure app shell availability even in offline mode.
- **Native API Integration (Camera):** Utilizes the device's native camera API for capturing images.
- **Graceful Degradation:** Provides alternative methods for devices without camera support (e.g., file upload).

## Technology Stack
- Developed using plain HTML, JavaScript, and CSS.<br/>
- Uses **Firebase** Database and **Firestore** to save and manage images and party data.

## Deployment
The app is deployed on Firebase. Access the live version here: https://photobooth-4a827.web.app/

## Getting Started
Clone the repository: `git clone <photo_booth_repository_url>`<br/>
Open the project in your preferred code editor.<br/>
Run the app using a local server to see it in action.<br/>

## Future Enhancements
Background sync, push notifications integration...
  

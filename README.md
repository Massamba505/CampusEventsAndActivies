# Events and Activities App

From the chaos of missed opportunities and fleeting gatherings, a beacon shall rise, heralding a new era of unity and shared experiences.
And we shall call it **EventHub**, for it shall be the thread that weaves together the fabric of our lives, connecting hearts and minds in a tapestry of unforgettable moments.



## Introduction

This is a group project for the Software Design Project (COMS3011A) module. We, the following students, have collaborated to create this project:

- Massamba Maphalala: [Massamba505](https://github.com/Massamba505)
- Siphelele Mthethwa: [SOMEONE1703](https://github.com/SOMEONE1703)
- Ritanzwe Mbedzi: [Ritanzwe](https://github.com/Ritanzwe)
- Kananelo Rampele: [Kanizo11](https://github.com/Kanizo11)
- Mukhunyeledzi Muthuphei: [Toby-Query](https://github.com/Toby-Query)
- Mukhathutsheli Ndou: [mucthecoder](https://github.com/mucthecoder)

## Overview

The **Events and Activities App** is designed to coordinate and manage all campus events, enhancing engagement and participation by providing a centralized platform for event creation, management, registration, ticketing (including ticket verification), and notifications. 

## Features

### Key Features
- **Event Creation and Management**: Tools for creating and managing campus events, including detailed descriptions, schedules, and locations.
- **Event Registration and Ticketing**: Enable users to register for events, purchase tickets, and receive digital tickets.
- **Notifications and Reminders**: Send automated notifications and reminders about upcoming events, changes, and cancellations.
- **Event Calendar**: Provide a comprehensive calendar view of all campus events.
- **Integration with Other Campus Services**: Seamlessly integrate with other campus apps like Classroom Management, Campus Safety, and Transportation Management.

### UI Development
- **User Dashboard**: Interface for browsing upcoming events, registering, and purchasing tickets.
- **Event Creation Interface**: Tools for event organizers to create and manage event details, including uploading images, setting dates, and managing registrations.
- **Ticketing System Interface**: Interface for users to view, purchase, and manage their tickets.
- **Notification Center**: Display notifications and reminders for events users are interested in or registered for.
- **Event Calendar Interface**: Visual calendar to display all events, allowing users to filter by date, type, and location.

### API Development
- **Event Management API**: Handle event creation, updates, cancellations, and details retrieval.
- **Registration and Ticketing API**: Manage event registrations, ticket sales, and digital ticket distribution.
- **Notification API**: Send automated notifications and reminders about events.
- **Calendar API**: Provide access to event calendar data, allowing for filtering and detailed views.
- **Integration API**: Facilitate data exchange with other campus services for seamless event coordination.

### Database Management
- **Event Database**: Store details of all events, including descriptions, schedules, locations, and organizer information.
- **Registration Database**: Track user registrations, ticket purchases, and attendance.
- **Notification Database**: Manage notifications and reminders, including user preferences and history.
- **User Database**: Store user profiles, event interests, and ticketing history.

### Infrastructure
- **Hosting and Scaling**: Ensure the server and database infrastructure on Azure can handle reasonable volumes of event data, registrations, and ticketing transactions, especially during peak times.
- **Security**: Implement robust security measures on Azure to protect user data, event details, and financial transactions.
- **Reliability**: Ensure reasonable availability and reliability of the platform, with minimal downtime.

## Stretch Goals

- **Push Notifications**: Implement push notifications for real-time updates on events and reminders. (Bonus Points)

## Technologies Used

- **Frontend**: Flutter for building a cross-platform mobile application with a responsive and modern UI.
- **Backend**: Azure services for hosting, managing APIs, and handling databases with scalability and security.
- **Database**: MongoDB to manage and store all event, user, and ticketing data.
- **Hosting**: Azure App Services for reliable and scalable deployment.
- **Security**: Azure Active Directory for secure authentication and authorization mechanisms.

## How to Run the Project

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Massamba505/CampusEventsAndActivies.git
    ```

2. **Install Dependencies**:
    ```bash
    cd your-react-app
    npm install
    ```

3. **Run the App**:
    ```bash
    npm start
    ```

4. **Access the Backend**:
    The backend is hosted on Azure, and all API calls are routed through Azure API Management.

5. **Run the Tests**:
    ```bash
    npm test
    ```

## Contributors

- Massamba Sabelo Maphalala: [Massamba505](https://github.com/Massamba505)
- Siphelele Mthethwa: [SOMEONE1703](https://github.com/SOMEONE1703)
- Ritanzwe Mbedzi: [Ritanzwe](https://github.com/Ritanzwe)
- Kananelo Rampele: [Kanizo11](https://github.com/Kanizo11)
- Mukhunyeledzi Muthuphei: [Toby-Query](https://github.com/Toby-Query)
- Mukhathutsheli Ndou: [mucthecoder](https://github.com/mucthecoder)


# Rocket.Chat HubSpot Integration App

This repository contains a **Rocket.Chat App** that integrates Rocket.Chat with **HubSpot**. The app allows you to fetch contacts from HubSpot and streamline communication by sending messages to your HubSpot contacts directly from Rocket.Chat. This integration empowers teams to manage their communication workflows efficiently within Rocket.Chat while leveraging HubSpot's CRM features.

---

## Features

- **Contact Synchronization**: Fetch contacts from your HubSpot account and display them in Rocket.Chat.
- **Messaging**: Send messages to your HubSpot contacts directly from Rocket.Chat's interface.
- **Streamlined Communication**: Combine the power of HubSpot's CRM with Rocket.Chat's messaging platform to improve productivity and collaboration.

---

## Prerequisites

Before you can install and use this app, ensure you have:

1. A Rocket.Chat server (version 3.0 or higher is recommended).
2. A HubSpot account with API access enabled.
3. Administrative privileges on your Rocket.Chat server.

---

## Installation

Follow these steps to install the Rocket.Chat HubSpot Integration App:

### Step 1: Clone the Repository

Clone this repository to your local environment:

```bash
git clone https://github.com/HazemHeakal/RocketChat-HubSpot.git
cd RocketChat-HubSpot
```

### Step 2: Deploy the App

1. Install the Rocket.Chat Apps CLI by following the official guide: [Rocket.Chat Apps CLI](https://developer.rocket.chat/guides/development/apps-cli).
2. Navigate to the project directory:
   ```bash
   cd RocketChat-HubSpot
   ```
3. Use the Apps CLI to deploy the app to your Rocket.Chat server:
   ```bash
   rc-apps deploy
   ```
   You'll need to provide the credentials for your Rocket.Chat server during this process.

### Step 3: Configure the App

Once deployed, configure the app from the Rocket.Chat admin panel:

1. Go to **Administration** > **Apps** > **HubSpot Integration**.
2. Enter your **HubSpot API Key** and any other required configuration values.
3. Save the configuration.

---

## Usage

### Fetching Contacts

1. Navigate to the Rocket.Chat channel or private chat where you want to fetch contacts.
2. Use the app's commands to fetch contacts:
   ```
   /hubspot fetch-contacts
   ```
   The contacts from your HubSpot account will be displayed in the chat.

### Sending Messages

1. Use the app command to send a message to a contact:
   ```
   /hubspot send-message [contact-email] [message-text]
   ```
   Replace `[contact-email]` with the email of the contact and `[message-text]` with the message you want to send.

---

## App Commands

| Command                   | Description                                          |
|---------------------------|------------------------------------------------------|
| `/hubspot fetch-contacts` | Fetch and display contacts from HubSpot.             |
| `/hubspot send-message`   | Send a message to a HubSpot contact.                 |

---

## Development

### Setting Up the Development Environment

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   rc-apps watch
   ```
   This will automatically deploy your changes to a Rocket.Chat server in development mode.

---

## Contributing

Contributions are welcome! If you find bugs or have ideas for new features, please open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [Rocket.Chat](https://rocket.chat/) for providing a powerful open-source chat platform.
- [HubSpot](https://hubspot.com/) for its CRM platform.

---
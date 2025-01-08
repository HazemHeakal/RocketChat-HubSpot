# Node.js App

This is a Node.js-based application with a modular architecture that includes controllers, routes, middleware, services, utilities, and models. The app is deployed directly to a workspace environment without using Docker containers.

## Prerequisites

- **Node.js**: v20.10.0 or later
- **npm**: Installed with Node.js
- **Rocket.Chat Apps TypeScript Compiler (rc-apps)**: Install globally using `npm install -g @rocket.chat/apps-cli`

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url> main
   cd <repository-folder>
   ```

2. Compile the TypeScript code:
   ```bash
   tsc
   ```
3. Package the app for Rocket.Chat:
   ```bash
   rc-apps package
   ```
4. Upload the generated app zip file to your Rocket.Chat workspace as a private app:
   - Navigate to **Administration** > **Apps** in your Rocket.Chat workspace.
   - Select **Upload App** and choose the zip file created in the previous step.

5. Enable the app in your Rocket.Chat workspace.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature-name'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For any issues or questions, please open an issue in the repository or contact the maintainers.

---

Happy coding!
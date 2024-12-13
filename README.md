# Smart Inventory Automation

Smart Inventory Automation is a web application designed to automate the inventory management process. This system helps manage and track stock levels, payments, suppliers, and more, through an intuitive and user-friendly interface. The application leverages the Google Gemini API for Optical Character Recognition (OCR) to extract data from invoices, ensuring accurate and efficient inventory management.

## Features

- **Automated Inventory Management**: Automatically tracks and manages stock levels.
- **Invoice OCR**: Uses the Google Gemini API to extract data from invoices, reducing manual data entry.
- **Low Stock Alerts**: Get notified when stock levels fall below the defined threshold.
- **Payment Tracking**: Keep track of payments related to inventory purchases.
- **Custom User Roles**: Manage users with different roles such as Admin, Manager, and Staff.
- **Supplier Management**: Manage supplier details and link them to inventory items.

## Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS
- **Backend**: Node.js, Hono
- **Database**: PostgreSQL (using Neon.tech)
- **ORM**: Prisma ORM
- **Cloud Hosting**: Cloudflare

## Installation

### Prerequisites

- Node.js (version >= 16.x)
- PostgreSQL database
- Prisma ORM
- Google Gemini API key for invoice OCR

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/krishna2474/Smart-Inventory-Automation.git
   ```

2. Navigate into the project directory:

   ```bash
   cd Smart-Inventory-Automation
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the `.env` file for configuration:

   - Create a `.env` file in the root directory of the project.
   - Add the necessary environment variables (such as your Google Gemini API key, database connection string, etc.).

5. Run the application:
   ```bash
   npm run dev
   ```

## Usage

Once the application is running, visit the following URL in your browser:

```
http://localhost:3000
```

You can log in as a **Manager** or **Admin** and start managing the inventory. Admin users can configure stock levels, suppliers, and roles. Managers can track inventory and make payments, while staff can perform day-to-day operations.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements

- **Google Gemini API**: For enabling OCR functionality to automate invoice data extraction.
- **TailwindCSS**: For styling the frontend with a modern and responsive design.
- **Prisma ORM**: For seamless database integration and management.

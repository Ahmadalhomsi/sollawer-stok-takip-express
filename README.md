# ERP Order and Control Management System

This project is an ERP (Enterprise Resource Planning) Order and Control Management System built with React for the frontend and Express.js for the backend. The system allows users to manage orders, control cards, card parameters, faulty cards, and more, with features like dark mode, data grid tables, and integration with PostgreSQL via Prisma ORM.

## Project Structure

The project is divided into two main folders:

- **client**: Contains the React frontend.
- **server**: Contains the Express.js backend.

## Features

- **Order Management**: Manage orders with detailed shipment and invoice statuses.
- **Control Card Management**: Track and manage control cards, including revision details and related card parameters.
- **Customer and Project Management**: Manage customers and associated projects with location details.
- **Faulty Card Tracking**: Track faulty cards with status and fault details.
- **Stock and Bill of Product Management**: Manage stock items, movements, and bills of products for production orders.
- **Excel Import/Export**: Import and export data using Excel files.
- **Dark Mode**: Toggle between light and dark modes using MUI's ThemeProvider.
- **Notifications**: Real-time notifications with React Hot Toast.
- **Responsive UI**: Built with Material UI (MUI) components like DataGrid, Icons, TextFields, Buttons, and Autocompletes.

## Tech Stack

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Material UI (MUI)**: React components for faster and easier web development.
- **React Hot Toast**: Notifications system.
- **Axios**: Promise-based HTTP client for making requests.
- **Prisma**: ORM for database management.
- **React Router**: For routing and navigation.

### Backend
- **Express.js**: Web framework for Node.js.
- **Prisma**: Database ORM for PostgreSQL.
- **PostgreSQL**: Relational database management system.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ahmadalhomsi/sollawer-stok-takip-express.git
   ```

2. **Install dependencies:**

    > [!TIP]
    > Open VS Code with Splitted Terminal for `Client` and `Server`
   * Client:
    ```sh
    cd client
    npm install
    ```

    * Server:
    ```sh
    cd server
    npm install
    ```
    
3. **Set up the database:**
    * Create a PostgreSQL database and update the `DATABASE_URL` in the `.env` file located in  the `server` folder.  

        ```ruby
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
        ```

    * Server:
        ```sh
        npx prisma db push
        ```
  

4. **Run the project:**

    * Client:
    ```sh
    npm start
    ```

    * Server:
    ```sh
    npm run dev
    ```

5. **Access the application:**
   * The client will be running at `http://localhost:3000`.
   * The server will be running at `http://localhost:5000`.

## Screenshots
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/1.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/2.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/3.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/4.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/5.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/6.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/7.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/8.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/9.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/10.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/11.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/12.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/13.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/14.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/15.png>)
![](<https://github.com/Ahmadalhomsi/sollawer-stok-takip-express/blob/sollawer-stok-takip-express/client/public/16.png>)

<!-- ![](<https://github.com/Ahmadalhomsi/Academic-Publication-Search-Engine/blob/Academic-Publication-Search-Engine/public/2.png>) -->
  
## Routes
The application includes the following routes:  
`/`: Orders page  
`/card`: Control card management  
`/cardParameter`: Manage card   
`/faultyCard`: Faulty card tracking  
`/excelImport`: Import data from Excel  
`/excelExport`: Export data to Excel  
`/customer`: Manage customers  
`/project`: Manage projects  
`/erp/stock`: Manage stock  
`/erp/stockMovement`: Track stock movements  
`/erp/billOfProduct`: Manage bills of products  
`/erp/productionOrder`: Manage production orders  
`/erp/analytics`: View analytics  





# <span style="color: #ffd800 ">ERP Order and Control Management System</span>

This project is an ERP (Enterprise Resource Planning) Order and Control Management System built with React for the frontend and Express.js for the backend. The system allows users to manage orders, control cards, card parameters, faulty cards, and more, with features like dark mode, data grid tables, and integration with PostgreSQL via Prisma ORM.

## <span style="color: #ffd800 ">Project Structure</span>

The project is divided into two main folders:

- **<span style="color: #BEA200 ">client</span>**: Contains the React frontend.
- **<span style="color: #BEA200 ">server</span>**: Contains the Express.js backend.

## <span style="color: #ffd800 ">Features</span>

- **<span style="color: #BEA200 ">Order Management</span>**: Manage orders with detailed shipment and invoice statuses.
- **<span style="color: #BEA200 ">Control Card Management</span>**: Track and manage control cards, including revision details and related card parameters.
- **<span style="color: #BEA200 ">Customer and Project Management</span>**: Manage customers and associated projects with location details.
- **<span style="color: #BEA200 ">Faulty Card Tracking</span>**: Track faulty cards with status and fault details.
- **<span style="color: #BEA200 ">Stock and Bill of Product Management</span>**: Manage stock items, movements, and bills of products for production orders.
- **<span style="color: #BEA200 ">Excel Import/Export</span>**: Import and export data using Excel files.
- **<span style="color: #BEA200 ">Dark Mode</span>**: Toggle between light and dark modes using MUI's ThemeProvider.
- **<span style="color: #BEA200 ">Notifications</span>**: Real-time notifications with React Hot Toast.
- **<span style="color: #BEA200 ">Responsive UI</span>**: Built with Material UI (MUI) components like DataGrid, Icons, TextFields, Buttons, and Autocompletes.

## <span style="color: #ffd800 ">Tech Stack</span>

### Frontend
- **<span style="color: #BEA200 ">React</span>**: JavaScript library for building user interfaces.
- **<span style="color: #BEA200 ">Material UI (MUI)</span>**: React components for faster and easier web development.
- **<span style="color: #BEA200 ">React Hot Toast</span>**: Notifications system.
- **<span style="color: #BEA200 ">Axios</span>**: Promise-based HTTP client for making requests.
- **<span style="color: #BEA200 ">Prisma</span>**: ORM for database management.
- **<span style="color: #BEA200 ">React Router</span>**: For routing and navigation.

### Backend
- **<span style="color: #BEA200 ">Express.js</span>**: Web framework for Node.js.
- **<span style="color: #BEA200 ">Prisma</span>**: Database ORM for PostgreSQL.
- **<span style="color: #BEA200 ">PostgreSQL</span>**: Relational database management system.

## <span style="color: #ffd800 ">Installation</span>

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
  
## <span style="color: #ffd800 ">Routes</span>
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

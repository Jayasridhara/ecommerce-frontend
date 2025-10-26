🎨 PHASE 3 — Frontend (React + Redux + Tailwind)
🧩 Common Components

Navbar, Footer, ProductCard, ProtectedRoute

Reusable modals: AlertModal, ConfirmDeleteModal, AddressModal

👤 Authentication Pages

Login

Register (with role toggle)

Forgot Password / Reset Password

Profile Page

🛍️ Buyer Section

Home Page: Product listing + filters + search

Product Details Page: Add to cart / wishlist / reviews

Cart Page: Update quantity, remove item, checkout button

Checkout Page: Address + Payment integration

Orders Page: View past orders and statuses

Wishlist Page

💼 Seller Dashboard

Add / Edit / Delete Products

View Orders 

Sales Report 


Manage Profile (store name, contact info, etc.)

🚀 PHASE 4 — Deployment

Frontend:

Build React app → Deploy to Netlify

Example: https://shopversein.netlify.app/

Backend:

Deploy Node.js + Express API → Render

Example: [https://ecommerce-backend.onrender.com](https://ecommerce-backend-1-ldht.onrender.com/api/v1

Connect frontend → backend

Update .env in React:

Backend URL render=https://ecommerce-backend-1-ldht.onrender.com/api/v1


Ensure CORS is enabled in backend:

app.use(cors({ origin: "https://shopversein.netlify.app", credentials: true }));

🧾 PHASE 5 — Submission

✅ Push both repos to GitHub
✅ Include README.md with:

Tech stack

Features

Deployment links

✅ Submit:

Frontend Netlify URL

Backend Render URL

GitHub repositories

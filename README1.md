🎯 Interact Club of Kolhapur – Website

Official website for the Interact Club of Kolhapur with a simple public site and an easy-to-use admin panel for managing content.

🔗 Live Site: https://interactkolhapur.org

📌 About the Project

This project was built to help the Interact Club:

Share information about the club

Publish events, news, and photos

Display board members

Allow visitors to contact the club

Update everything using an admin dashboard (no coding needed)

✨ Features
🌍 Public Website

Home page with club introduction

Live statistics (members, events, impact, awards)

Past and upcoming events

Board of Directors list

News & updates

Photo gallery

Contact form

🔐 Admin Panel

Secure login

Dashboard overview

Manage:

Board members

Events (past & upcoming)

News articles

Photo gallery

Contact messages

Website statistics

Admin access:
/admin/login

🧑‍💻 Tech Stack
Frontend

React

React Router

Tailwind CSS

Shadcn UI

Axios

Backend

FastAPI (Python)

MongoDB

JWT Authentication

Hosting

Frontend: Vercel

Backend: Railway

Database: MongoDB Atlas

DNS: Cloudflare

📁 Project Structure
interact-club-kolhapur/
├── frontend/        # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
│
├── backend/         # FastAPI backend
│   ├── server.py
│   ├── models.py
│   ├── auth.py
│   ├── seed_data.py
│   └── requirements.txt
│
└── README.md

🚀 Getting Started
For Club Admins (No Coding Required)

Go to /admin/login

Login with admin credentials

Select a section (Events, News, Gallery, etc.)

Add, edit, or delete content

Save changes — updates appear instantly

Uploading Images

Upload from your computer

Or paste an image URL (Google Drive supported)

🔧 Local Development (For Developers)
Requirements

Node.js 18+

Python 3.9+

MongoDB

Frontend Setup
cd frontend
npm install --legacy-peer-deps
npm start

Backend Setup
cd backend
pip install -r requirements.txt
uvicorn server:app --reload

🌐 API Overview
Public Endpoints

GET /board-members

GET /events/past

GET /events/upcoming

GET /news

GET /gallery

POST /contact/submit

Protected Endpoints (JWT required)

CRUD operations for:

Board members

Events

News

Gallery

GET /contact/submissions

GET /settings

PUT /settings

🛠️ Troubleshooting

Can’t login?

Check credentials

Clear browser cache

Try incognito mode

Changes not visible?

Hard refresh (Ctrl + F5)

Ensure you clicked Save

Wait a few seconds

Image upload failed?

Max size: 5MB

Use JPG / PNG / GIF

Try image URL instead


📄 License

Built exclusively for Interact Club of Kolhapur.

🙏 Acknowledgements

Rotary International

Interact Club Board Members

All Interact Club Members

❤️ Credits

Developed by:
Itr. Om Malani
International Service Director, RI 2025–26

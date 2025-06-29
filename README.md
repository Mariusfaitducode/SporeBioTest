# SporeBioTest 🧪

Biological sample (BioSamples) management application with integrated comment system.

## 📋 Overview

SporeBioTest is a full-stack application for managing biological samples. It provides a modern interface to create, view, modify and delete samples, with the ability to add comments for each sample.

**Development time:** 3 hours

## 🏗️ Architecture

- **Backend:** REST API with FastAPI (Python)
- **Frontend:** React application with TypeScript
- **Database:** SQLite with SQLModel/SQLAlchemy
- **Routing:** React Router v7

## 🚀 Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- pnpm (recommended)

### Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start server**
   ```bash
   uvicorn main:app --reload
   ```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start application**
   ```bash
   pnpm dev
   ```

Frontend will be available at `http://localhost:5173`

### Environment Variables

No environment variables needed. The application uses default configurations.


## 📁 Structure du projet

```
SporeBioTest/
├── backend/
│   ├── api/           # Endpoints API
│   ├── models/        # Modèles SQLModel
│   ├── schemas/       # Schémas Pydantic  
│   ├── db/           # Configuration base de données
│   └── main.py       # Point d'entrée FastAPI
└── frontend/
    ├── src/
    │   ├── components/   # Composants React
    │   ├── api/         # Services API
    │   ├── types/       # Types TypeScript
    │   └── utils/       # Utilitaires
    └── package.json
```


## ✨ Features

### Main Features

- **📊 Sample listing:** Overview with responsive grid
- **➕ Add samples:** Creation form with validation
- **✏️ Edit samples:** Modify existing data
- **🗑️ Delete samples:** Deletion with confirmation
- **💬 Comment system:** Add and delete comments per sample
- **📄 Pagination:** Optimized navigation with frontend caching
- **🎨 Modern interface:** Responsive design with loading states

## 📊 Data Model

### BioSample
- `id`: Unique identifier
- `sampling_location`: Collection location
- `type`: Sample type (water, chocolate, flour, etc.)
- `sampling_date`: Collection date
- `sampling_operator`: Operator who performed collection

### Comment
- `id`: Unique identifier
- `biosample_id`: Reference to sample
- `content`: Comment content
- `created_at`: Creation date

## 🔧 API Endpoints

### BioSamples
- `GET /biosamples/`: Paginated list of samples
- `POST /biosamples/`: Create a sample
- `GET /biosamples/{id}`: Sample details
- `PUT /biosamples/{id}`: Modify a sample
- `DELETE /biosamples/{id}`: Delete a sample

### Comments
- `GET /comments/`: List comments
- `POST /comments/`: Create a comment
- `GET /comments/{id}`: Comment details
- `PUT /comments/{id}`: Modify a comment
- `DELETE /comments/{id}`: Delete a comment

## 🎯 Potential Improvements

### Features
- **🔐 Authentication system:** User and permission management
- **🔍 Search and filters:** Filter by type, date, operator
- **📊 Dashboard:** Statistics and metrics
- **📤 Data export:** CSV/PDF export of samples
- **🔔 Notifications:** Alerts for new comments

### Technical
- **🎨 Styling with Tailwind CSS and shadcn/ui:** More modern interface
- **🧪 Automated testing:** Backend (pytest) and frontend (Vitest)
- **🚀 Deployment:** Docker configuration and CI/CD
- **📱 PWA:** Progressive web application
- **🔄 Real-time sync:** WebSockets for updates

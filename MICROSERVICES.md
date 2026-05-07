# Nutrix Microservices Architecture

This project has been refactored from a monolithic architecture to a microservices architecture with an API Gateway pattern.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (3000)                     │
└────────────┬────────────────────────────────────────────────┘
             │
             │ HTTP Requests
             ▼
┌─────────────────────────────────────────────────────────────┐
│               API Gateway (Port 5050)                        │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │ Routes   │ Validate │ Forward  │ Respond  │             │
│  └──────────┴──────────┴──────────┴──────────┘             │
└─┬──────────┬──────────┬──────────┐────────────────────────┘
  │          │          │          │
  ▼          ▼          ▼          ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│ Auth   ││History ││Recipe  ││Profile │
│ 5051   ││ 5052   ││ 5053   ││ 5054   │
└─┬──────┘└─┬──────┘└─┬──────┘└─┬──────┘
  │         │        │         │
  └─────────┴────────┴─────────┘
            │
            ▼
      ┌───────────────┐
      │   MongoDB     │
      │  Nutrix_Data  │
      └───────────────┘
```

## Services

### 1. **API Gateway** (Port 5050)
- Main entry point for all frontend requests
- Routes requests to appropriate microservices
- Handles CORS and error responses
- **File**: `server/gateway/gateway.js`

### 2. **Auth Service** (Port 5051)
- User authentication (login/register)
- Password hashing with bcrypt
- User credential validation
- **Endpoints**:
  - `POST /login` - User login
  - `POST /register` - New user registration
- **File**: `server/services/auth/server.js`

### 3. **History Service** (Port 5052)
- Meal history tracking
- Weekly nutrition statistics
- Historical data aggregation
- **Endpoints**:
  - `POST /` - Save meal history entry
  - `GET /` - Fetch user's meal history
  - `GET /weekly` - Get weekly statistics
- **File**: `server/services/history/server.js`

### 4. **Recipe Service** (Port 5053)
- AI-powered recipe generation
- Uses Google Gemini API
- Generates nutritional information
- **Endpoints**:
  - `POST /generate` - Generate recipe from ingredients
- **File**: `server/services/recipe/server.js`

### 5. **Profile Service** (Port 5054)
- User profile management
- Update user preferences and settings
- **Endpoints**:
  - `PUT /:email` - Update user profile
- **File**: `server/services/profile/server.js`

## Running the Services

### Option 1: Run All Services at Once
```bash
npm install  # Install dependencies including concurrently
npm run services:start
```

### Option 2: Run Services Individually
```bash
# Terminal 1 - API Gateway
npm run gateway

# Terminal 2 - Auth Service
npm run auth-service

# Terminal 3 - History Service
npm run history-service

# Terminal 4 - Recipe Service
npm run recipe-service

# Terminal 5 - Profile Service
npm run profile-service
```

### Option 3: Run Frontend Only
```bash
npm run dev
```

## Environment Variables

Update `server/config.env`:

```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

# API Gateway
PORT=5050

# Service Ports & URLs (optional - defaults shown)
AUTH_SERVICE_PORT=5051
AUTH_SERVICE_URL=http://localhost:5051

HISTORY_SERVICE_PORT=5052
HISTORY_SERVICE_URL=http://localhost:5052

RECIPE_SERVICE_PORT=5053
RECIPE_SERVICE_URL=http://localhost:5053

PROFILE_SERVICE_PORT=5054
PROFILE_SERVICE_URL=http://localhost:5054
```

## Database

All services share a single MongoDB database (`Nutrix_Data`) with collections:
- `Users` - User credentials and profiles
- `History` - Meal history records

## Frontend Configuration

The frontend automatically routes all requests to the API Gateway at `http://localhost:5050`. No frontend changes are needed for basic functionality.

## Benefits of This Architecture

1. **Scalability** - Services can be scaled independently
2. **Maintainability** - Each service has a single responsibility
3. **Fault Isolation** - If one service fails, others continue operating
4. **Independent Deployment** - Services can be deployed separately
5. **Clear Separation of Concerns** - Easy to understand and modify individual services

## Monitoring

Each service logs to console on startup:
```
Auth Service listening on port 5051
History Service listening on port 5052
Recipe Service listening on port 5053
Profile Service listening on port 5054
API Gateway listening on port 5050
```

## Health Check

Check if API Gateway is running:
```bash
curl http://localhost:5050/health
```

Response:
```json
{"status": "API Gateway is running"}
```

## Troubleshooting

### Connection Refused Errors
- Ensure all services are running
- Check if ports 5050-5054 are available
- Verify MongoDB connection string in config.env

### Service Not Responding
- Check service logs for errors
- Ensure the specific service is running on the correct port
- Verify network connectivity between gateway and services

### CORS Issues
Update `allowedOrigins` in `server/gateway/gateway.js` to include your frontend domain.

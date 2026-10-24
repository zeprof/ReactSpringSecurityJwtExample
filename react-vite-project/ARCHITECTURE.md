# Architecture Guide

This project demonstrates a React + Spring Boot application with JWT authentication and role-based access control. It's designed for students learning about secure web authentication.

## Project Structure

```
src/
├── components/           # React UI components
│   ├── auth/            # Authentication-related components
│   │   ├── LoginForm.jsx    # Login form with validation
│   │   └── Logout.jsx       # Logout handler
│   ├── page/            # Role-specific home pages
│   │   ├── EmprunteurHome.jsx
│   │   ├── PreposeHome.jsx
│   │   └── GestionnaireHome.jsx
│   ├── Header.jsx       # Navigation header with user info
│   ├── Footer.jsx       # Page footer
│   ├── PageLayout.jsx   # Main layout wrapper
│   └── MainContainer.jsx # Home page content
├── context/
│   └── AuthContext.jsx  # Authentication state management (Context API)
├── utils/
│   ├── roleNavigation.js # Maps roles to page routes
│   ├── validation.js     # Form validation functions
│   └── fetcher.js        # HTTP request helper
├── App.jsx              # Main app with route definitions
└── main.jsx             # App entry point with providers
```

## Authentication Flow

### 1. **Initial Page Load**

When a user first visits the app:

```
main.jsx
  ↓
AuthProvider (wraps entire app)
  ↓
App.jsx calls useEffect → refreshUser()
  ↓
AuthContext checks if token exists in localStorage
```

### 2. **Token Refresh (AuthContext.hydrateUserFromToken)**

This function runs on app startup:

- **If NO token exists**: User is logged out, state set to `null`
- **If token exists**: 
  1. Sends request to `/user/me` endpoint
  2. Backend validates token and returns user data
  3. User data stored in localStorage and React state
  4. If token is invalid/expired, token is cleared

### 3. **Login Flow**

User enters email/password in LoginForm:

```
1. Form validates input (validateEmail, validatePassword)
2. Sends POST to /user/login with credentials
3. Backend returns access token
4. Token stored in localStorage
5. Request to /user/me to get user details
6. User data stored in state
7. Redirected to role-specific page (via getNavigationPath)
```

### 4. **Protected Routes**

Three protection mechanisms:

**RequireAuth**: Checks if user is logged in
- ✅ User logged in → Show component
- ❌ User NOT logged in → Redirect to `/login`
- ⏳ Loading → Show "Loading..."

**RequireRole**: Checks if user has required role
- ✅ User has role → Show component
- ❌ User lacks role → Redirect to `/`
- ⏳ Loading → Show "Loading..."

**App Routes**: 
- `/` - Public (anyone can visit)
- `/about` - Public
- `/login` - Public (redirects if already logged in)
- `/logout` - Public
- `/emprunteur` - Protected (ROLE_EMPRUNTEUR, ROLE_GESTIONNAIRE)
- `/prepose` - Protected (ROLE_PREPOSE, ROLE_GESTIONNAIRE)
- `/gestionnaire` - Protected (ROLE_GESTIONNAIRE only)

### 5. **Logout Flow**

```
User clicks Logout
  ↓
Logout component calls logout() from AuthContext
  ↓
Token removed from localStorage
  ↓
User state set to null
  ↓
Redirect to home or login
```

## Key Concepts for Students

### **JWT (JSON Web Token)**

A JWT is a compact token containing encoded user information. It's sent with each request for authentication:

```
localStorage.getItem("token") → Added to API requests → Backend validates → Grants access
```

**Why JWT?** 
- Stateless: Server doesn't need to store sessions
- Works across different servers/services
- Contains user data (no database lookup needed)

### **Context API vs Props**

This app uses React Context instead of prop drilling:

```
❌ Without Context (prop drilling):
App → PageLayout → Header → useAuth (6 levels deep)

✅ With Context:
Any component can useAuth() directly
```

### **Role-Based Access Control (RBAC)**

Three roles in this app:

| Role | Access |
|------|--------|
| ROLE_EMPRUNTEUR | Borrower page |
| ROLE_PREPOSE | Staff page |
| ROLE_GESTIONNAIRE | Admin - can see all pages |

The `Header` component dynamically shows nav links based on user role.

## File-by-File Guide

### `AuthContext.jsx`
- `useAuth()` - Custom hook to access auth state
- `AuthProvider` - Wraps app, provides auth context to all children
- `hydrateUserFromToken()` - Checks if user has valid token on startup
- `login()` - Handles login with email/password
- `logout()` - Clears token and user state
- `RequireAuth` - Component guard for authenticated users
- `RequireRole` - Component guard for users with specific roles

### `App.jsx`
- Defines all routes using React Router
- Calls `refreshUser()` on mount to restore session
- Uses `RequireAuth` and `RequireRole` to protect routes

### `LoginForm.jsx`
- Validates email and password using utility functions
- Calls `login()` from AuthContext
- Redirects to role-specific page after successful login

### `Header.jsx`
- Gets current user from `useAuth()`
- Shows different nav links based on user role
- Shows user info when logged in

## Common Student Questions

**Q: Where does the JWT token come from?**
A: The backend `/user/login` endpoint returns it after validating credentials.

**Q: Why store token in localStorage?**
A: So the user stays logged in even after page refresh. The token persists in localStorage.

**Q: What happens if token expires?**
A: When `hydrateUserFromToken()` runs, the backend rejects the expired token, it's removed from localStorage, and user is logged out.

**Q: Why use Context API?**
A: Avoids prop drilling. Authentication state is needed in many places, Context makes it accessible everywhere with `useAuth()`.

**Q: How are roles checked on the backend?**
A: The backend validates the JWT token (which contains the role) before allowing access to protected endpoints.

## Running the App

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm build
```

## Testing the Authentication

1. **Test Login Flow**: 
   - Go to `/login`
   - Enter credentials (check backend for test users)
   - Observe token stored in browser DevTools → Application → localStorage

2. **Test Protected Routes**:
   - Try accessing `/gestionnaire` without logging in
   - Should redirect to `/login`

3. **Test Role-Based Access**:
   - Login as ROLE_EMPRUNTEUR
   - Try accessing `/gestionnaire`
   - Should redirect to home (no permission)

## Next Steps for Learning

1. Check the backend code to see how tokens are generated
2. Look at token validation in backend endpoints
3. Understand JWT structure (decode at jwt.io)
4. Learn about refresh tokens (not in this version)
5. Explore CORS configuration for frontend-backend communication

# Auth Provider / User Context

Complete guide for using the Authentication Provider and User Context in the Hospital AI Dashboard.

## 📋 Overview

The Auth Provider (`AuthContext`) manages user authentication state throughout the application. It provides user data, authentication status, and methods for login/logout operations.

## 🔧 Setup

### 1. Wrap Your App with AuthProvider

```typescript
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return <AuthProvider>{/* Your app components */}</AuthProvider>;
}
```

### 2. User Type Definition

Located in `src/types/user.ts`:

```typescript
export interface User {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: "admin" | "doctor" | "nurse" | "staff";
  avatar?: string;
  department?: string;
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
```

## 🎯 Usage

### Basic Usage

```typescript
import { useAuth } from "../contexts/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {user?.role}</p>
      <p>Department: {user?.department}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Available Properties & Methods

#### Properties

| Property          | Type           | Description                                      |
| ----------------- | -------------- | ------------------------------------------------ |
| `user`            | `User \| null` | Current user object or null if not authenticated |
| `isAuthenticated` | `boolean`      | True if user is logged in                        |
| `isLoading`       | `boolean`      | True during authentication operations            |

#### Methods

| Method       | Parameters                                              | Description                                   |
| ------------ | ------------------------------------------------------- | --------------------------------------------- |
| `login`      | `(username: string, password: string) => Promise<void>` | Authenticates user and stores in localStorage |
| `logout`     | `() => void`                                            | Clears user data and localStorage             |
| `updateUser` | `(userData: Partial<User>) => void`                     | Updates user information                      |

## 📝 Examples

### Login Example

```typescript
import { useAuth } from "../contexts/AuthContext";

const LoginForm = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password);
      // Redirect or show success message
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div>{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
```

### Protected Component Example

```typescript
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedComponent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Hello, {user?.name}!</p>
    </div>
  );
};
```

### Update User Information

```typescript
import { useAuth } from "../contexts/AuthContext";

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();

  const handleUpdateName = (newName: string) => {
    updateUser({ name: newName });
  };

  const handleUpdateDepartment = (department: string) => {
    updateUser({ department });
  };

  return (
    <div>
      <p>Current Name: {user?.name}</p>
      <button onClick={() => handleUpdateName("New Name")}>Update Name</button>
    </div>
  );
};
```

### Role-Based Access Control

```typescript
import { useAuth } from "../contexts/AuthContext";

const AdminPanel = () => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel Content</div>;
};
```

### Check User Permissions

```typescript
import { useAuth } from "../contexts/AuthContext";

const FeatureComponent = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string) => {
    return (
      user?.permissions?.includes("all") ||
      user?.permissions?.includes(permission)
    );
  };

  return (
    <div>
      {hasPermission("write") && <button>Edit</button>}
      {hasPermission("read") && <div>View Content</div>}
    </div>
  );
};
```

## 🔐 Authentication Flow

1. **User logs in** → `login(username, password)` is called
2. **Mock user created** → User object is generated (replace with API call)
3. **Stored in localStorage** → Auth data persisted as `hospital_ai_auth`
4. **State updated** → `user` state is set, `isAuthenticated` becomes `true`
5. **Components re-render** → All components using `useAuth()` get updated user data

## 💾 Storage

User data is stored in `localStorage` under the key `hospital_ai_auth`:

```json
{
  "user": {
    "id": "user_1234567890",
    "username": "admin",
    "email": "admin@hospital.com",
    "name": "Admin",
    "role": "admin",
    "department": "General Medicine",
    "permissions": ["all"]
  },
  "token": "mock_token_1234567890"
}
```

## 🔄 Integration with Backend API

To integrate with a real backend, update the `login` function in `src/contexts/AuthContext.tsx`:

```typescript
const login = async (username: string, password: string) => {
  setIsLoading(true);
  try {
    // Replace with actual API call
    const response = await authService.login(username, password);

    const authData: AuthResponse = {
      user: response.user,
      token: response.token,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    setUser(response.user);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

## 🛡️ Protected Routes

Example of protecting routes:

```typescript
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};
```

## 📍 File Locations

- **Auth Context**: `src/contexts/AuthContext.tsx`
- **User Types**: `src/types/user.ts`
- **Auth Service**: `src/service/auth.ts`

## ⚠️ Important Notes

1. **Mock Authentication**: Currently uses mock data. Replace with API calls when backend is ready.
2. **LocalStorage**: User data persists across page refreshes.
3. **Error Handling**: Always wrap `login` calls in try-catch blocks.
4. **Loading States**: Use `isLoading` to show loading indicators during auth operations.
5. **Type Safety**: User type is fully typed - use TypeScript for best experience.

## 🐛 Troubleshooting

**User is null after login:**

- Check localStorage for `hospital_ai_auth` key
- Verify login function completes successfully
- Check browser console for errors

**Protected routes not working:**

- Ensure `AuthProvider` wraps your app
- Check `isAuthenticated` value
- Verify route protection logic

**User data not persisting:**

- Check localStorage is enabled in browser
- Verify JSON parsing/stringifying works
- Check for localStorage quota exceeded errors

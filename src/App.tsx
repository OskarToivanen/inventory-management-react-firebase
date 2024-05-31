import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// Component import
import SidebarWithHeader from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './components/AuthProvider'
import Dashboard from './components/DashBoard'

// Pages imports
import RentalFormPage from './pages/RentalFormPage'
import ClientFormPage from './pages/ClientFormPage'
import ClientsPage from './pages/ClientsPage'
import RentalsPage from './pages/RentalsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <SidebarWithHeader>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/clients'
              element={
                <ProtectedRoute>
                  <ClientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/rentals'
              element={
                <ProtectedRoute>
                  <RentalsPage />
                </ProtectedRoute>
              }
            />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route
              path='/new-client'
              element={
                <ProtectedRoute>
                  <ClientFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/new-rental'
              element={
                <ProtectedRoute>
                  <RentalFormPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </SidebarWithHeader>
      </Router>
    </AuthProvider>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/auth/AuthContext';
import { useContext } from 'react';

import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import RecipeList from './components/recipes/RecipeList';
import RecipeForm from './components/recipes/RecipeForm';
import MainLayout from './components/MainLayout';
import MealPlanList from './components/recipes/MealPlanList';
import MealPlanner from "./components/planner/MealPlanner";
import ProfilePage from './components/user/ProfilePage';
import CreateRecipe from './pages/CreateRecipe';
import SearchPage from './pages/SearchPage';
import PrivateRoute from './components/auth/PrivateRoute';
import Footer from './components/common/Footer';
import useIsMobile from './hooks/useIsMobile';
import LandingPage from './pages/LandingPage';


function AppRoutes() {
  const { user } = useContext(AuthContext);
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <>
          <MainLayout>
            <Routes>
              <Route path="/" element={<RecipeList />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/meal-plan" element={<MealPlanList />} />
              <Route path="/planner" element={<MealPlanner />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MainLayout>
          {!isMobile && <Footer />}
        </>
      )}
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

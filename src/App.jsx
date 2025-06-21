import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/create" element={
              <PrivateRoute>
                <CreateRecipe />
              </PrivateRoute>
            } />

            <Route path="/search" element={<SearchPage />} />

            <Route path="/meal-plan" element={<MealPlanList />} />
            <Route
              path="/planner"
              element={
                <PrivateRoute>
                  <MealPlanner />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

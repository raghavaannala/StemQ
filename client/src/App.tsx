import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import SignIn from "@/pages/SignIn";
import GradeSelection from "@/pages/GradeSelection";
import GradeDashboard from "@/pages/GradeDashboard";
import Games from "@/pages/Games";
import GamePlayer from "@/pages/GamePlayer";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Authentication Routes */}
          <Route path="/signin" component={SignIn} />
          
          {/* Redirect root to signin for authentication */}
          <Route path="/">
            {() => {
              window.location.href = '/signin';
              return null;
            }}
          </Route>
          
          {/* Protected Grade-specific Dashboards */}
          <Route path="/dashboard/:grade">
            {(params) => (
              <ProtectedRoute requireGrade={params.grade}>
                <GradeDashboard grade={params.grade} />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Protected Grade-specific Games */}
          <Route path="/games/:grade">
            {(params) => (
              <ProtectedRoute requireGrade={params.grade}>
                <Games grade={params.grade} />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Protected Individual Game Player */}
          <Route path="/game/:grade/:gameId">
            {(params) => (
              <ProtectedRoute requireGrade={params.grade}>
                <GamePlayer grade={params.grade} gameId={params.gameId} />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Protected Grade-specific Quiz Routes */}
          <Route path="/quiz/:grade/:subject/:topic/:quizId">
            {(params) => (
              <ProtectedRoute requireGrade={params.grade}>
                <Quiz 
                  grade={params.grade}
                  subjectId={params.subject}
                  topicId={params.topic}
                  quizId={params.quizId}
                />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Protected Grade-specific Analytics */}
          <Route path="/analytics/:grade">
            {(params) => (
              <ProtectedRoute requireGrade={params.grade}>
                <Analytics grade={params.grade} />
              </ProtectedRoute>
            )}
          </Route>
          
          {/* Legacy Routes - Redirect to signin */}
          <Route path="/home">
            {() => {
              window.location.href = '/signin';
              return null;
            }}
          </Route>
          <Route path="/grade-selection">
            {() => {
              window.location.href = '/signin';
              return null;
            }}
          </Route>
          
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

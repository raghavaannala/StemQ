import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Quiz from "@/pages/Quiz";
import Analytics from "@/pages/Analytics";
import NotFound from "@/pages/not-found";
import GradeSelection from "@/pages/GradeSelection";
import GradeDashboard from "@/pages/GradeDashboard";
import Games from "@/pages/Games";
import GamePlayer from "@/pages/GamePlayer";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Grade Selection - Entry Point */}
          <Route path="/" component={GradeSelection} />
          <Route path="/grade-selection" component={GradeSelection} />
          
          {/* Grade-specific Dashboards */}
          <Route path="/dashboard/:grade">
            {(params) => <GradeDashboard grade={params.grade} />}
          </Route>
          
          {/* Grade-specific Games */}
          <Route path="/games/:grade">
            {(params) => <Games grade={params.grade} />}
          </Route>
          
          {/* Individual Game Player */}
          <Route path="/game/:grade/:gameId">
            {(params) => <GamePlayer grade={params.grade} gameId={params.gameId} />}
          </Route>
          
          {/* Grade-specific Quiz Routes */}
          <Route path="/quiz/:grade/:subject/:topic/:quizId">
            {(params) => (
              <Quiz 
                grade={params.grade}
                subjectId={params.subject}
                topicId={params.topic}
                quizId={params.quizId}
              />
            )}
          </Route>
          
          {/* Grade-specific Analytics */}
          <Route path="/analytics/:grade">
            {(params) => <Analytics grade={params.grade} />}
          </Route>
          
          {/* Legacy Routes - Redirect to Grade Selection */}
          <Route path="/home" component={GradeSelection} />
          <Route path="/quiz" component={GradeSelection} />
          <Route path="/analytics" component={GradeSelection} />
          
          {/* 404 */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

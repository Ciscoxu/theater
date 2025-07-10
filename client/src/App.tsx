import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Theater from "@/pages/Theater";
import Characters from "@/pages/Characters";
import Chat from "@/pages/Chat";
import Scripts from "@/pages/Scripts";
import Rehearsals from "@/pages/Rehearsals";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Theater} />
          <Route path="/theater" component={Theater} />
          <Route path="/characters" component={Characters} />
          <Route path="/chat/:characterId" component={Chat} />
          <Route path="/scripts" component={Scripts} />
          <Route path="/rehearsals" component={Rehearsals} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="theater-ui-theme">
        <div className="min-h-screen bg-background">
          <Router />
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
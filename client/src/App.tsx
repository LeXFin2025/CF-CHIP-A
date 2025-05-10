import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import Browser from "@/pages/apps/Browser";
import Mail from "@/pages/apps/Mail";
import Calendar from "@/pages/apps/Calendar";
import Documents from "@/pages/apps/Documents";
import Notes from "@/pages/apps/Notes";
import Tasks from "@/pages/apps/Tasks";
import Contacts from "@/pages/apps/Contacts";
import Drive from "@/pages/apps/Drive";
import Maps from "@/pages/apps/Maps";
import Translate from "@/pages/apps/Translate";
import Weather from "@/pages/apps/Weather";
import News from "@/pages/apps/News";
import Photos from "@/pages/apps/Photos";
import Music from "@/pages/apps/Music";
import Videos from "@/pages/apps/Videos";
import Podcasts from "@/pages/apps/Podcasts";
import Calculator from "@/pages/apps/Calculator";
import CodeEditor from "@/pages/apps/CodeEditor";
import PasswordManager from "@/pages/apps/PasswordManager";
import Settings from "@/pages/apps/Settings";
import DomainEmailUsers from "@/pages/apps/DomainEmailUsers";
import AppLayout from "@/components/layout/AppLayout";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppLayout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/browser" component={Browser} />
            <Route path="/mail" component={Mail} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/documents" component={Documents} />
            <Route path="/notes" component={Notes} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/drive" component={Drive} />
            <Route path="/maps" component={Maps} />
            <Route path="/translate" component={Translate} />
            <Route path="/weather" component={Weather} />
            <Route path="/news" component={News} />
            <Route path="/photos" component={Photos} />
            <Route path="/music" component={Music} />
            <Route path="/videos" component={Videos} />
            <Route path="/podcasts" component={Podcasts} />
            <Route path="/calculator" component={Calculator} />
            <Route path="/code-editor" component={CodeEditor} />
            <Route path="/password-manager" component={PasswordManager} />
            <Route path="/settings" component={Settings} />
            <Route path="/domain-users/:id" component={DomainEmailUsers} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

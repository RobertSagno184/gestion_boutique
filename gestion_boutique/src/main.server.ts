import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Accept the server BootstrapContext and forward it to bootstrapApplication
const bootstrap = (context: any) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;

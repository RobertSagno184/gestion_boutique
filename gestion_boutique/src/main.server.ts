import { ApplicationConfig, Provider, EnvironmentProviders } from '@angular/core';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext, options?: { providers?: (Provider | EnvironmentProviders)[] }) => {
  const configWithContext: ApplicationConfig = {
    ...config,
    providers: [
      ...(config.providers || []),
      ...(options?.providers || [])
    ]
  };
  return bootstrapApplication(AppComponent, configWithContext, context);
};

export default bootstrap;

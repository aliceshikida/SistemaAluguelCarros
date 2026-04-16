package com.example.aluguel.bootstrap;

import io.micronaut.context.annotation.Requires;
import io.micronaut.context.event.ApplicationEventListener;
import io.micronaut.context.event.StartupEvent;
import jakarta.inject.Singleton;

@Singleton
@Requires(property = "app.dev.seed.enabled", value = "true")
public class DevDataStartupListener implements ApplicationEventListener<StartupEvent> {

    private final DevDataSeedService devDataSeedService;

    public DevDataStartupListener(DevDataSeedService devDataSeedService) {
        this.devDataSeedService = devDataSeedService;
    }

    @Override
    public void onApplicationEvent(StartupEvent event) {
        devDataSeedService.seedIfNeeded();
    }
}

package com.example.sistemagestaocarros.security;

import io.micronaut.core.order.Ordered;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;

@Singleton
@Filter("/**")
public class JwtAuthenticationFilter implements HttpServerFilter, Ordered {

    private final JwtTokenService jwtTokenService;

    public JwtAuthenticationFilter(JwtTokenService jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public Publisher<io.micronaut.http.MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
        String path = request.getPath();
        if (!path.startsWith("/api/")) {
            return chain.proceed(request);
        }
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            return chain.proceed(request);
        }

        String auth = request.getHeaders().getAuthorization().orElse(null);
        if (auth == null || !auth.startsWith("Bearer ")) {
            return io.micronaut.core.async.publisher.Publishers.just(HttpResponse.status(HttpStatus.UNAUTHORIZED));
        }
        String token = auth.substring(7).trim();
        try {
            JwtClaims claims = jwtTokenService.parse(token);
            request.setAttribute("userId", claims.userId());
            request.setAttribute("userRole", claims.role());
            request.setAttribute("tipoAgente", claims.tipoAgente());
            return chain.proceed(request);
        } catch (Exception e) {
            return io.micronaut.core.async.publisher.Publishers.just(HttpResponse.status(HttpStatus.UNAUTHORIZED));
        }
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE + 50;
    }
}

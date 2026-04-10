package com.example.sistemagestaocarros.security;

import io.micronaut.core.async.publisher.Publishers;
import io.micronaut.core.order.Ordered;
import io.micronaut.http.HttpMethod;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MutableHttpResponse;
import io.micronaut.http.annotation.Filter;
import io.micronaut.http.filter.HttpServerFilter;
import io.micronaut.http.filter.ServerFilterChain;
import jakarta.inject.Singleton;
import org.reactivestreams.Publisher;

@Singleton
@Filter("/**")
public class CorsFilter implements HttpServerFilter, Ordered {

@Override
public Publisher<MutableHttpResponse<?>> doFilter(HttpRequest<?> request, ServerFilterChain chain) {
    if (request.getMethod() == HttpMethod.OPTIONS) {
        return Publishers.just(corsHeaders(HttpResponse.ok()));
    }
    // Envolve a chain para adicionar headers CORS em toda resposta
    return new Publisher<MutableHttpResponse<?>>() {
        @Override
        public void subscribe(org.reactivestreams.Subscriber<? super MutableHttpResponse<?>> subscriber) {
            chain.proceed(request).subscribe(new org.reactivestreams.Subscriber<MutableHttpResponse<?>>() {
                @Override
                public void onSubscribe(org.reactivestreams.Subscription s) {
                    subscriber.onSubscribe(s);
                }

                @Override
                public void onNext(MutableHttpResponse<?> response) {
                    subscriber.onNext(corsHeaders(response));
                }

                @Override
                public void onError(Throwable t) {
                    subscriber.onError(t);
                }

                @Override
                public void onComplete() {
                    subscriber.onComplete();
                }
            });
        }
    };
}

private MutableHttpResponse<?> corsHeaders(MutableHttpResponse<?> response) {
    return response
        .header("Access-Control-Allow-Origin", "*")
        .header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH,OPTIONS")
        .header("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept,Origin,X-Requested-With")
        .header("Access-Control-Expose-Headers", "Authorization")
        .header("Access-Control-Max-Age", "3600");
}

@Override
public int getOrder() {
    return Ordered.HIGHEST_PRECEDENCE;
}
}
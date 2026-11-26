FROM nginx/nginx-unprivileged:1.31.10-alpine3.24-slim AS base

USER root
RUN apk upgrade --no-cache \
    && rm -rf /var/cache/apk/*
USER 101

FROM scratch

COPY --from=base / /

COPY index.html background.js /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons

ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

STOPSIGNAL SIGQUIT
USER 101

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

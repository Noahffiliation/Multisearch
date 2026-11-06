FROM nginx/nginx-unprivileged:1.31.8-alpine3.24-slim

USER root
RUN apk update \
    && apk upgrade \
    && rm -rf /var/cache/apk/*
USER 101

COPY index.html background.js /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

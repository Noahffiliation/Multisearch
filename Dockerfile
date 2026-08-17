FROM nginxinc/nginx-unprivileged:1.28.0-alpine3.21-slim

USER root
RUN apk upgrade --no-cache
USER 101

COPY index.html background.js /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

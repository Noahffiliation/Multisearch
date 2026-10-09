FROM nginxinc/nginx-unprivileged:1.31-alpine3.24-slim

USER root
RUN apk upgrade --no-cache && apk add --no-cache 'zlib>=1.3.2-r1'
USER 101

COPY index.html background.js /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

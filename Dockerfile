FROM nginxinc/nginx-unprivileged:1.27.4-alpine3.21-slim

COPY index.html background.js /usr/share/nginx/html/
COPY icons /usr/share/nginx/html/icons

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

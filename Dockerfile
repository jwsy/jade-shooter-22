FROM nginxinc/nginx-unprivileged:1.23-alpine-slim
EXPOSE 8080
COPY dist/ /usr/share/nginx/html

# FROM nginx:alpine
# EXPOSE 80

# COPY dist/index.html /usr/share/nginx/html
# COPY dist/ /usr/share/nginx/html/dist
# COPY sprites /usr/share/nginx/html/sprites
# COPY sounds /usr/share/nginx/html/sounds

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx","-g","daemon off;"]

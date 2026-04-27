FROM nginxinc/nginx-unprivileged
EXPOSE 8080
COPY dist/ /usr/share/nginx/html
COPY nginx-aio.conf /etc/nginx/conf.d/aio.conf

# FROM nginx:alpine
# EXPOSE 80

# COPY dist/index.html /usr/share/nginx/html
# COPY dist/ /usr/share/nginx/html/dist
# COPY sprites /usr/share/nginx/html/sprites
# COPY sounds /usr/share/nginx/html/sounds

ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["nginx","-g","daemon off;"]

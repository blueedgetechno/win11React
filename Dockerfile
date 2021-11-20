FROM node:14-alpine3.14

# set working directory
WORKDIR /usr/src/windows11/

# setup env vars
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production
LABEL org.opencontainers.image.description A recreation of windows 11 in react
LABEL org.opencontainers.image.authors blueedge

# install http server
RUN npm install -g serve

# add app (add .dockerignore to remove useless files from the image)
RUN wget https://github.com/blueedgetechno/win11React/archive/refs/heads/gh-pages.zip
RUN unzip gh-pages.zip

# expose port
EXPOSE 3000

# start app
ENTRYPOINT ["serve", "/usr/src/windows11/win11React-gh-pages", "-p", "3000", "-d", "--cors"]

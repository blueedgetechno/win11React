FROM node:14-alpine3.14

# set working directory
WORKDIR /usr/src/windows11/

# setup env vars
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

# install http server
RUN npm install serve

# add app (add .dockerignore to remove useless files from the image)
COPY . .

# expose port
EXPOSE 3000

# start app
ENTRYPOINT ["serve", "/usr/src/windows11/build"]

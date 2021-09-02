FROM node:14-alpine3.14

# set working directory
WORKDIR /usr/src/windows11/

# setup env vars
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_ENV=production

# install app dependencies
COPY package*.json ./
RUN npm install --production --frozen-lockfile # install only production deps with exact lockfile versions

# add app (add .dockerignore to remove useless files from the image)
COPY . .

# expose port
EXPOSE 3000

# start app
ENTRYPOINT ["npm", "start"]

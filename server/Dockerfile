FROM node:8
WORKDIR /app/server
COPY package.json .
RUN npm install --quiet
COPY . .
ENV NODE_ENV=production
EXPOSE 9000
CMD [ "npm", "start" ]

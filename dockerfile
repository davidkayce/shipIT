FROM node:10.15.3

WORKDIR /usr/src/fabric

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
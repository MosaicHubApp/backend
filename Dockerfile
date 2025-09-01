FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g @nestjs/cli
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run typeorm:migration:run && npm run start:dev"]
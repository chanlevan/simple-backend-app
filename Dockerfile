FROM node:10

WORKDIR /app/

COPY package*.json ./

RUN npm install --quite

RUN mkdir server
COPY ./server ./server

COPY ./mongo/wait /wait
RUN chmod +x /wait

EXPOSE 3000
CMD /wait && npm run prod
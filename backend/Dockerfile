FROM node:22-bookworm

WORKDIR /app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

RUN pip3 install --break-system-packages -r ml/requirements.txt

EXPOSE 5000

CMD ["npm", "start"]
FROM oven/bun:latest
COPY . .
RUN bun install
EXPOSE 50051
CMD [ "bun", "run", "greeter_server.js" ]
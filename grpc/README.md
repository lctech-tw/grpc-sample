# gRPC Greeter Service

## Deploying a gRPC service using Docker and Google Cloud Run

```sh
gcloud auth configure-docker
docker buildx create --use --name multiplatform-builder
docker buildx build --platform linux/amd64,linux/arm64 \
    -t asia.gcr.io/lc-hogwarts/greeter-server:v1 \
    --push .

# docker push asia.gcr.io/lc-hogwarts/greeter-server:v1
gcloud run deploy grpc-service \
    --image asia.gcr.io/lc-hogwarts/greeter-server:v1 \
    --platform managed \
    --region asia-east1 \
    --allow-unauthenticated \
    --port 50051 \
    --use-http2 \
    --project lc-hogwarts
```

## Quick test

```sh
bun run greeter-service.ts
```

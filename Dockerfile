# base image
FROM node:18.17.0-bullseye-slim as base

# Set Enviroments
ENV ENV_LOADER Docker
ENV PATH /app/node_modules/.bin:$PATH
ENV PORT 3000
ENV HOST "0.0.0.0"
ENV NODEEWEB_COM_AUTH_PROVIDER="https://nodeeweb.com/api/v1/auth/jwt"
ENV NODEEWEB_IR_AUTH_PROVIDER="https://nodeeweb.ir/api/v1/auth/jwt"

# Expose All Ports
EXPOSE ${PORT}

# Change Work directory
WORKDIR /app

FROM base as build

# Copy packege json and package lock
COPY package.json yarn.lock ./

# Install Packages
RUN yarn install

# Copy modules
COPY . .

# Build
RUN yarn build

# Replace Packages with Production one
RUN rm -rf node_modules && \
    yarn install --production && \
    yarn cache clean --force 

FROM base as production
ENV NODE_ENV "production"

# Copy packages
COPY --from=build /app/node_modules ./node_modules

# Copy Build Files
COPY --from=build /app/dist /app/package.json /app/tsconfig.json ./

# Execute
CMD ["node","server"]
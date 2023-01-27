FROM node:lts-alpine

RUN npm -v && node -v

WORKDIR /bad-practice
COPY package.json package-lock.json node_modules/ ./
COPY . .
RUN npm prune --production
EXPOSE 3000
ENV NODE_ENV="production"
CMD [ "npm", "start" ]

# FROM node:lts-alpine
# RUN npm -v
# RUN node -v

# WORKDIR /app

# # ADD package.json .npmrc ./  # Remix indie stack dockerfile
# COPY package.json .
# RUN npm install

# COPY . .

# RUN npx prisma generate

# RUN npm run build

# EXPOSE 3000

# ENV NODE_ENV=production

# CMD [ "npm", "start" ]



# REMIX RUN INDIE STACK DOCKERFILE
# base node image
# FROM node:16-bullseye-slim as base

# # set for base and all layer that inherit from it
# ENV NODE_ENV production

# # Install openssl for Prisma
# RUN apt update

# # Install all node_modules, including dev dependencies
# FROM base as deps

# WORKDIR /remix

# ADD package.json .npmrc ./
# RUN npm install --production=false

# # Setup production node_modules
# FROM base as production-deps

# WORKDIR /remix

# COPY --from=deps /remix/node_modules /remix/node_modules
# ADD package.json .npmrc ./
# RUN npm prune --production

# # Build the app
# FROM base as build

# WORKDIR /remix

# COPY --from=deps /remix/node_modules /remix/node_modules

# ADD prisma .
# RUN npx prisma generate

# ADD . .
# RUN npm run build

# # Finally, build the production image with minimal footprint
# FROM base

# # ENV PORT="8080"
# ENV NODE_ENV="production"

# WORKDIR /remix

# COPY --from=production-deps /remix/node_modules /remix/node_modules
# COPY --from=build /remix/node_modules/.prisma /remix/node_modules/.prisma

# COPY --from=build /remix/build /remix/build
# COPY --from=build /remix/public /remix/public
# COPY --from=build /remix/package.json /remix/package.json
# COPY --from=build /remix/start.sh /remix/start.sh
# COPY --from=build /remix/prisma /remix/prisma

# CMD [ "npm", "start" ]
# # ENTRYPOINT [ "./start.sh" ]

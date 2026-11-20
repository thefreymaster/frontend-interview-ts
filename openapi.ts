export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "TypeScript Interview Mock API",
    version: "1.0.0",
    description:
      "Mock pixel and user data for local development. Socket.IO also streams pixel quality changes every five seconds in a repeating one-minute cycle; see the README for event documentation. No authentication is required.",
  },
  servers: [{ url: "/", description: "Current API server" }],
  tags: [
    { name: "Pixels", description: "Generated mock pixel data" },
    { name: "User", description: "Mock current-user profile" },
  ],
  paths: {
    "/api/v1/pixels": {
      get: {
        tags: ["Pixels"],
        operationId: "getPixels",
        summary: "Get 10,000 pixels for a 100 by 100 grid",
        description:
          "Regenerates hypothetical interview data on every request with exactly 9,400 green pixels (94%), 500 yellow pixels (5%), and 100 red pixels (1%). Color assignments are shuffled while IDs stay fixed. Intensity and RGB sub-pixel values are randomized. Green pixels are healthy; yellow and red pixels are not. Resets the quality simulation and broadcasts the new snapshot to connected Socket.IO clients.",
        responses: {
          "200": {
            description: "An array of 10,000 pixels with sequential IDs",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  minItems: 10000,
                  maxItems: 10000,
                  items: { $ref: "#/components/schemas/Pixel" },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/pixels/{id}": {
      get: {
        tags: ["Pixels"],
        operationId: "getPixel",
        summary: "Get a pixel by ID",
        description:
          "Returns the pixel from the current live state shared across clients, including Socket.IO quality changes. Before the first list request, uses startup data and the running simulation. Detail requests do not regenerate data.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The pixel ID from the list response",
            schema: { type: "integer", minimum: 1, maximum: 10000 },
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "The pixel and its detailed metadata and RGB values",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Pixel" },
              },
            },
          },
          "404": {
            description: "The pixel ID is invalid or does not exist",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Pixel not found" },
              },
            },
          },
        },
      },
    },
    "/api/v1/user": {
      get: {
        tags: ["User"],
        operationId: "getUser",
        summary: "Get the mock current user",
        responses: {
          "200": {
            description: "A fixed mock user profile",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
                example: {
                  id: "user-001",
                  name: "Alex Morgan",
                  email: "alex.morgan@example.com",
                  role: "viewer",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Pixel: {
        type: "object",
        required: ["id", "healthy", "meta_data", "sub_pixels"],
        properties: {
          id: { type: "integer", minimum: 1, maximum: 10000, example: 1 },
          healthy: {
            type: "boolean",
            description: "True for green pixels, false for yellow or red pixels",
            example: true,
          },
          meta_data: {
            type: "object",
            required: ["intensity", "color"],
            properties: {
              intensity: {
                type: "integer",
                minimum: 0,
                maximum: 100,
                example: 75,
              },
              color: {
                type: "string",
                enum: ["green", "yellow", "red"],
                description: "94% green, 5% yellow, and 1% red in each list response",
                example: "green",
              },
            },
          },
          sub_pixels: {
            type: "object",
            description: "RGB channel intensities, each from 0 to 255",
            required: ["red", "green", "blue"],
            properties: {
              red: { type: "integer", minimum: 0, maximum: 255, example: 128 },
              green: { type: "integer", minimum: 0, maximum: 255, example: 64 },
              blue: { type: "integer", minimum: 0, maximum: 255, example: 255 },
            },
          },
        },
      },
      Error: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string", example: "Pixel not found" },
        },
      },
      User: {
        type: "object",
        required: ["id", "name", "email", "role"],
        properties: {
          id: { type: "string", example: "user-001" },
          name: { type: "string", example: "Alex Morgan" },
          email: {
            type: "string",
            format: "email",
            example: "alex.morgan@example.com",
          },
          role: { type: "string", enum: ["viewer", "admin"], example: "viewer" },
        },
      },
    },
  },
};

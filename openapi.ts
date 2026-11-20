const todoResponse = {
  description: "Candidate handler is not implemented yet",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
      example: { message: "TODO: implement the endpoint" },
    },
  },
};

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "TypeScript Pixel Interview API",
    version: "1.0.0",
    description:
      "Three candidate endpoints using a supplied 10,000-pixel dataset. Handlers initially return 501 TODO responses. No authentication is required.",
  },
  servers: [{ url: "/", description: "Current API server" }],
  tags: [{ name: "Pixels", description: "Generated mock pixel data" }],
  paths: {
    "/api/v1/pixels": {
      get: {
        tags: ["Pixels"],
        operationId: "getPixels",
        summary: "Get 10,000 pixels for a 100 by 100 grid",
        description:
          "Returns the current shared dataset, generated at startup with exactly 9,400 green pixels, 500 yellow pixels, and 100 red pixels. Requests do not regenerate the data.",
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
          "501": todoResponse,
        },
      },
    },
    "/api/v1/pixels/grid": {
      get: {
        tags: ["Pixels"],
        operationId: "getPixelGrid",
        summary: "Get 100 rows of 100 pixels",
        description:
          "Reshapes the shared dataset in input order without mutation. Each row is a separate array; each cell contains the complete pixel object.",
        responses: {
          "200": {
            description: "A 100 by 100 two-dimensional pixel array",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  minItems: 100,
                  maxItems: 100,
                  items: {
                    type: "array",
                    minItems: 100,
                    maxItems: 100,
                    items: { $ref: "#/components/schemas/Pixel" },
                  },
                },
              },
            },
          },
          "500": {
            description: "The supplied dataset cannot form a 100 by 100 grid",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "501": todoResponse,
        },
      },
    },
    "/api/v1/pixels/{id}": {
      get: {
        tags: ["Pixels"],
        operationId: "getPixel",
        summary: "Get a pixel by ID",
        description:
          "Returns one pixel from the shared dataset by ID, not array position. IDs must be positive safe integers; absent IDs return 404.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "The pixel ID from the list response",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: Number.MAX_SAFE_INTEGER,
            },
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
          "400": {
            description: "The ID is not a positive safe integer",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Pixel ID must be a positive integer" },
              },
            },
          },
          "404": {
            description: "No pixel has the requested ID",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { message: "Pixel not found" },
              },
            },
          },
          "501": todoResponse,
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
    },
  },
};

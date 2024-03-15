import allowedOrigins from "./allowedOrigins.js";

var corsOptions = {
  // origin: (origin, callback) => {
  //   console.log("origin: ", origin);
  //   if (allowedOrigins.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     console.log("Not allowed by CORS");
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
};

export default corsOptions;

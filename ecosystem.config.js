module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./pyramid-project-management-BE",
      script: "npm",
      args: "run start:prod",
      env: {
        PORT: 3001,
        NODE_ENV: "production"
      }
    },
    {
      name: "frontend",
      cwd: "./pyramid-project-management-FE",
      script: "npm",
      args: "start",
      env: {
        PORT: 3000,
        NODE_ENV: "production"
      }
    }
  ]
};

FROM solace/solace-agent-mesh:latest

# Switch to root to install the plugin (safe during build)
USER root

# Install the REST gateway plugin using SAM's plugin system
RUN sam plugin add http-rest --plugin sam-rest-gateway

# Set the working directory
WORKDIR /app

# Switch back to non-root user for runtime security
# Check what user the base image uses and switch to it
USER 1000:1000

# Default command
CMD ["sam", "run"]

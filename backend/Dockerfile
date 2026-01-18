FROM solace/solace-agent-mesh:latest

# Switch to root to install the plugin (safe during build)
USER root

# Install the REST gateway plugin using SAM's plugin system
RUN sam plugin add http-rest --plugin sam-rest-gateway

# Install additional requirements (redis, etc.)
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt && rm /tmp/requirements.txt

# Install your custom plugin package
COPY src/my-hello-agent /tmp/my-hello-agent
RUN pip install /tmp/my-hello-agent && rm -rf /tmp/my-hello-agent

COPY src/recipe-generator /tmp/recipe-generator
RUN pip install /tmp/recipe-generator && rm -rf /tmp/recipe-generator

# Set the working directory
WORKDIR /app

# Switch back to non-root user for runtime security
# Check what user the base image uses and switch to it
USER 1000:1000

# Default command
CMD ["sam", "run"]

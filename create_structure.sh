#!/bin/bash

# Define the base directory for the project
BASE_DIR="my-job-scheduler"

# Create the base directory and enter it
mkdir -p $BASE_DIR
cd $BASE_DIR

# Create the src directory structure
mkdir -p src/{config,jobs/steps,models,services,utils,repositories}

# Create the test directory structure mirroring src
mkdir -p test/{jobs,models,services,utils}

# Create initial files
touch src/config/index.js
touch src/jobs/index.js
touch src/jobs/JobScheduler.js
touch src/jobs/JobLauncher.js
touch src/jobs/Job.js
touch src/jobs/steps/Step1.js
touch src/jobs/steps/Step2.js
touch src/models/index.js
touch src/models/JobModel.js
touch src/models/StepModel.js
touch src/services/index.js
touch src/services/ItemReader.js
touch src/services/ItemProcessor.js
touch src/services/ItemWriter.js
touch src/utils/logger.js
touch src/utils/errorHandler.js
touch src/repositories/index.js
touch src/repositories/JobRepository.js
touch src/repositories/StepRepository.js
touch src/app.js
touch src/server.js

# Create node_modules directory and package files
mkdir -p node_modules
touch package.json
touch package-lock.json

# Create other root-level files
touch .env
touch .gitignore
touch README.md

# Print the structure
echo "Created project structure:"
tree $BASE_DIR

# Back to the original directory
cd ..

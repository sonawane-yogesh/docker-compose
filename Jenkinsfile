pipeline {
    agent any
    stages {
        stage('Run npm install') {
            steps {
                echo 'Running npm install command...'
                npm install
            }
        }
        stage('Run tsc command') {
            steps {
                echo 'Running tsc command...'                
                npm run postinstall
            }
        }
        stage('Run start command') {
            steps {
                echo 'Starting server application...'
                npm start
            }
        }
    }
}
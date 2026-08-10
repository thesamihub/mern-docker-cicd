pipeline {
    agent { label 'jenkins-agent-1' }

    environment {
        PROD_SERVER = 'ubuntu@100.61.39.88'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage("Checkout"){
            steps {
                echo 'Cloning repo'
                git url: 'https://github.com/thesamihub/mern-docker-cicd.git',
                    branch: 'main'
                echo 'Code cloned successfully.'
            }
        }
        stage("build"){
            steps {
                echo 'Building Docker image'

                sh '''
                    docker build -t thesamihub/mern-docker-cicd-frontend:$IMAGE_TAG ./frontend
                    docker build -t thesamihub/mern-docker-cicd-backend:$IMAGE_TAG ./backend
                '''
                echo 'Images Built Successfully'
            }
        }
        stage("Push Images to Dockerhub"){
            steps {
                echo 'Pushing images to Docker Hub...'
                
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhubcred',
                    usernameVariable: 'HUB_USER',
                    passwordVariable: 'HUB_PASS'
                )]) {
                    sh '''
                        echo $HUB_PASS | docker login -u $HUB_USER --password-stdin

                        docker push thesamihub/mern-docker-cicd-frontend:$IMAGE_TAG
                        docker push thesamihub/mern-docker-cicd-backend:$IMAGE_TAG

                        docker logout
                    '''
                }
            }
        }
        stage("Deploy"){
            steps{
                echo 'SSh and Deploy on production server'
                sshagent(['jenkins-agent-1-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no "$PROD_SERVER" "
                            cd /home/ubuntu/MERN_Stack_CRUD &&
                            export IMAGE_TAG=$IMAGE_TAG &&
                            docker compose pull &&
                            docker compose up -d --remove-orphans --force-recreate
                        "
                    '''
                }
            }
        }
    }
    post {

        always {
            echo 'Cleaning Docker build cache...'

            sh '''
                docker builder prune -af || true
                docker image prune -af || true
            '''
        }

        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}
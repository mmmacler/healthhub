# Azenda

## Project Overview
Azenda is a mental health and task organization app designed to help users manage their daily schedules effectively. The app provides an interactive calendar where users can add tasks, set priorities, and receive optimized scheduling based on their time constraints. Azenda aims to assist individuals, including college students and working professionals, in organizing their tasks to reduce stress and improve productivity.

## Table of Contents
- [Installation](#installation)
- [Running Project](#running-project)
- [Project Setup](#project-setup)
- [Team Roles and Development Tasks](#team-roles-and-development-tasks)
- [Cross-Team Collaboration](#cross-team-collaboration)
- [Project Documentation and Deployment](#project-documentation-and-deployment)
- [Contributing](#contributing)

## Installation

### Setting up Virtual Environment
First, ensure that Python(version 3.10 and up) with Pip, npm package manager, and Node.js are installed\
Using a python virtual environment is strongly recommended for running the backend server

#### Open a terminal, navigate to healthhub/azenda/ in your personal repository, and run the following commands
``` bash
py -m venv venv
venv\Scripts\activate #this command can be used at any time to run your virtual environment
```
You will know the virtual environmnet is running when you can see (venv) next to your directory listing in terminal
### Setting up Backend
#### Installing Dependencies
Run the following command in the virtual environment at `healthhub/azenda/` to install required django configurations

``` bash
pip install -r requirements.txt
```

#### Setting up Database
Run following commands in the virtual environment at `healthhub/azenda/backend/` to set up database
``` bash
py manage.py check
py manage.py makemigrations
py manage.py migrate
```
The above commands should also be run whenever a change is made to `healthhub/azenda/backend/accounts/models.py`

### Setting up Frontend
#### Create a new terminal(virtual environment isn't needed for next.js ) and navigate to `healthhub/azenda/app/`, then run following command
``` bash
npm install
```

## Running Project
### Backend
At healthhub/azenda/backend while using virtual environment in terminal, run
``` bash
  py manage.py runserver
```
### Front End
While backend server is running on the first terminal, open a second one, navigate to `healthhub/azenda/app/`, and run
``` bash
  npm run dev
```
### Opening App
Now, the app is available at  `http://localhost:3000/` and can be accessed from the browser


## Project Setup

### GitHub Repository
- Repository Name: `azenda`
- Initialize with a README and a `.gitignore` file suitable for HTML, CSS, JavaScript, Python, and SQL projects.

### Configuration Management
- Branch protections are set up on the main branch:
  - Require pull request reviews before merging.
  - Require status checks before merging.
  - Enforce branch updates before merging.

### Project Management Tools
- Utilize Trello for task tracking.
- Separate boards for Front-End, Back-End, Testing, and Deployment tasks.

## Team Roles and Development Tasks

### Front-End Team: Daniel Monzon and Vanessa Serrano
#### UI/UX Design
- Design wireframes using Figma for the interactive calendar and login screens.
- Ensure responsive and accessible design to cater to diverse users.
  
#### Front-End Development
- Implement front-end using Next.js framework.
- Integrate user interaction with back-end APIs for task management.
- Focus on adding/deleting tasks, recurring task scheduling, and task notifications.

#### Testing
- Perform interface testing for responsiveness and accessibility.
- Collaborate on integration testing with back-end APIs.

### Back-End Team: Aaditya Kaushal and Ryan Macler
#### Server Setup
- Use Django for backend development with a Monolithic architecture.
- Implement RESTful APIs for user management and task scheduling.

#### Database Management
- Set up PostgreSQL database for user accounts and task data.
- Ensure database integrity, security, and performance.

#### Testing and Security
- Implement unit and integration tests.
- Secure endpoints, use best practices for data validation, and ensure user privacy.

## Cross-Team Collaboration
- Weekly scrum meetings to synchronize progress and address challenges.
- Define and agree on API endpoints and data structures.
- Conduct regular code reviews using GitHub for version control.

## Project Documentation and Deployment
- Document all components and API endpoints.
- Use GitHub Wiki for project documentation and updates.
- Deploy the application on Heroku or AWS upon completion.

## Contributing
- For contributing, please fork the repository, create a feature branch, and submit a pull request for review.

Thank you for contributing to the success of Azenda!

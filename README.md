To set up the backend server using Express and TypeScript, you'll need to have Node.js and 
npm (Node Package Manager) installed on your system. Here are the steps to ensure you have everything you need:

## Step 1:
Install Node.js and npm
Download and Install Node.js:

Go to the Node.js download page.
Download the latest LTS (Long Term Support) version for your operating system.
Follow the installation instructions for your OS.
![image](https://github.com/Parthasarathi-D/form-management-backend/assets/141064484/7a5172fd-1923-40b8-b318-e7ff60bbae41)

## Verify the Installation:
Open a terminal or command prompt.
Run the following commands to check if Node.js and npm are installed correctly:
#### bash code
    node -v
    npm -v
    
These commands should return the version numbers of Node.js and npm.
![image](https://github.com/Parthasarathi-D/form-management-backend/assets/141064484/fef364a8-50eb-4ba5-9a82-03c47a855100)

## Step 2:
#### Set Up the Backend Server
#### Follow these steps to set up the backend server:

#### Create a New Directory for Your Project:

### bashcode
    mkdir backend
    cd backend

#### Initialize a New Node.js Project:

### bashcode
    npm init -y
    
![image](https://github.com/Parthasarathi-D/form-management-backend/assets/141064484/dc8895d9-6a05-4564-8646-ee5315c54923)

#### Install the Necessary Packages:

### bashcode
    npm install express body-parser cors
    npm install typescript @types/node @types/express @types/body-parser @types/cors ts-node --save-dev

![image](https://github.com/Parthasarathi-D/form-management-backend/assets/141064484/387cf98f-54cb-4924-aeba-c381c463e8ea)

#### Initialize TypeScript:

### bashcode
    npx tsc --init
![image](https://github.com/Parthasarathi-D/form-management-backend/assets/141064484/26ce57de-763a-4a8f-a6b1-f40efd9c7985)

#### Set Up the Project Files:

#### Create the src directory:

### bashcode
    mkdir src
    cd src
    touch index.ts db.json
![image](https://github.com/Parthasarathi-D/form-management-backend/assets/141064484/32f49462-2cf9-4348-931e-f8dad78fcbb1)

### Write the Server Code:

Add the  content to src/index.ts:

### typescript code
    import express, { Request, Response } from 'express';
    import bodyParser from 'body-parser';
    import fs from 'fs';
    import path from 'path';
    import { fileURLToPath } from 'url';
    
    // Resolve __dirname using import.meta.url (ES modules)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const app = express();
    const PORT = 3000;
    const dbFilePath = path.join(__dirname, 'db.json');
    
    // Middleware configuration
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    // Ensure db.json file exists
    if (!fs.existsSync(dbFilePath)) {
        fs.writeFileSync(dbFilePath, '[]', 'utf8');
    }
    
    // Endpoint to handle POST requests to save submissions
    app.post('/submit', (req: Request, res: Response) => {
        const { name, email, phone, github_link, stopwatch_time } = req.body;
    
        // Construct new submission object
        const newSubmission = {
            name,
            email,
            phone,
            github_link,
            stopwatch_time
        };
    
        try {
            // Read current data from db.json
            const currentData = fs.readFileSync(dbFilePath, 'utf8');
            const submissions = JSON.parse(currentData) as Array<any>;
    
            // Add new submission to array
            submissions.push(newSubmission);
    
            // Write updated data back to db.json
            fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
    
            res.status(200).send('Submission saved successfully.');
        } catch (error) {
            console.error('Error saving submission:', error);
            res.status(500).send('Failed to save submission.');
        }
    });
    
    // Endpoint to handle GET requests to read submissions
    app.get('/read', (req: Request, res: Response) => {
        const index = Number(req.query.index);
    
        try {
            // Read current data from db.json
            const currentData = fs.readFileSync(dbFilePath, 'utf8');
            const submissions = JSON.parse(currentData) as Array<any>;
    
            // Check if index is valid
            if (index >= 0 && index < submissions.length) {
                res.json(submissions[index]);
            } else {
                res.status(404).send('Submission not found.');
            }
        } catch (error) {
            console.error('Error reading submissions:', error);
            res.status(500).send('Failed to read submissions.');
        }
    });
    
    // Endpoint to handle POST requests to delete submissions
    app.post('/delete', (req: Request, res: Response) => {
        const index = Number(req.body.index);
    
        try {
            // Read current data from db.json
            const currentData = fs.readFileSync(dbFilePath, 'utf8');
            const submissions = JSON.parse(currentData) as Array<any>;
    
            // Check if index is valid
            if (index >= 0 && index < submissions.length) {
                // Remove submission from array
                submissions.splice(index, 1);
    
                // Write updated data back to db.json
                fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
    
                res.status(200).send('Submission deleted successfully.');
            } else {
                res.status(404).send('Submission not found.');
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            res.status(500).send('Failed to delete submission.');
        }
    });
    
    // Endpoint to handle POST requests to update submissions
    app.post('/update', (req: Request, res: Response) => {
        const { index, name, email, phone, github_link, stopwatch_time } = req.body;
    
        try {
            // Read current data from db.json
            const currentData = fs.readFileSync(dbFilePath, 'utf8');
            const submissions = JSON.parse(currentData) as Array<any>;
    
            // Check if index is valid
            if (index >= 0 && index < submissions.length) {
                // Update submission details
                submissions[index] = {
                    name,
                    email,
                    phone,
                    github_link,
                    stopwatch_time
                };
    
                // Write updated data back to db.json
                fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
    
                res.status(200).send('Submission updated successfully.');
            } else {
                res.status(404).send('Submission not found.');
            }
        } catch (error) {
            console.error('Error updating submission:', error);
            res.status(500).send('Failed to update submission.');
        }
    });
    
    // Endpoint to handle GET requests to search submissions by email
    app.get('/search', (req, res) => {
        const { email } = req.query;
    
        try {
            // Read current data from db.json
            const currentData = fs.readFileSync(dbFilePath, 'utf8');
            const submissions = JSON.parse(currentData);
    
            // Search for submission with matching email
            const foundSubmission = submissions.find((submission: any) => submission.email === email);
    
            if (foundSubmission) {
                res.json(foundSubmission);
            } else {
                res.status(404).send('Submission not found for the provided email.');
            }
        } catch (error) {
            console.error('Error searching submissions:', error);
            res.status(500).send('Failed to search submissions.');
        }
    });
    
    // Start server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });



#### Add the following content to src/db.json:

### jsoncode
    {
      "submissions": []
    }

### Add a Start Script to package.json:

Open package.json and add the script:

### jsoncode
    {
      "name": "slidelyai-backend",
      "version": "1.0.0",
      "main": "dist/index.js",
      "type": "module",
      "scripts": {
        "start": "node dist/index.js",
        "build": "tsc"
      },
      "dependencies": {
        "express": "^4.17.1",
        "body-parser": "^1.19.0"
      },
      "devDependencies": {
        "typescript": "^4.3.5",
        "@types/express": "^4.17.11",
        "@types/node": "^16.0.0"
      }
    }

## Step 3: 
#### Run the Server
#### Start the Server:

### bashcode
    npm start

![image](https://github.com/Parthasarathi-D/form-management-backend/assets/141064484/59b738eb-86b2-40d1-8cd6-137563f5a5f1)

This command will compile and run your TypeScript server. The server should be running on http://localhost:3000.

Step 4: Connect Your Forms to the Backend
Make sure the Windows Forms application can communicate with the backend server:

Ensure the backend server is running before testing the forms.
Use the appropriate endpoints in your Visual Basic code to submit and retrieve data.


import express from 'express';
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
app.post('/submit', (req, res) => {
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
        const submissions = JSON.parse(currentData);
        // Add new submission to array
        submissions.push(newSubmission);
        // Write updated data back to db.json
        fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
        res.status(200).send('Submission saved successfully.');
    }
    catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).send('Failed to save submission.');
    }
});
// Endpoint to handle GET requests to read submissions
app.get('/read', (req, res) => {
    const index = Number(req.query.index);
    try {
        // Read current data from db.json
        const currentData = fs.readFileSync(dbFilePath, 'utf8');
        const submissions = JSON.parse(currentData);
        // Check if index is valid
        if (index >= 0 && index < submissions.length) {
            res.json(submissions[index]);
        }
        else {
            res.status(404).send('Submission not found.');
        }
    }
    catch (error) {
        console.error('Error reading submissions:', error);
        res.status(500).send('Failed to read submissions.');
    }
});
// Endpoint to handle POST requests to delete submissions
app.post('/delete', (req, res) => {
    const index = Number(req.body.index);
    try {
        // Read current data from db.json
        const currentData = fs.readFileSync(dbFilePath, 'utf8');
        const submissions = JSON.parse(currentData);
        // Check if index is valid
        if (index >= 0 && index < submissions.length) {
            // Remove submission from array
            submissions.splice(index, 1);
            // Write updated data back to db.json
            fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
            res.status(200).send('Submission deleted successfully.');
        }
        else {
            res.status(404).send('Submission not found.');
        }
    }
    catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).send('Failed to delete submission.');
    }
});
// Endpoint to handle POST requests to update submissions
app.post('/update', (req, res) => {
    const { index, name, email, phone, github_link, stopwatch_time } = req.body;
    try {
        // Read current data from db.json
        const currentData = fs.readFileSync(dbFilePath, 'utf8');
        const submissions = JSON.parse(currentData);
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
        }
        else {
            res.status(404).send('Submission not found.');
        }
    }
    catch (error) {
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
        const foundSubmission = submissions.find((submission) => submission.email === email);
        if (foundSubmission) {
            res.json(foundSubmission);
        }
        else {
            res.status(404).send('Submission not found for the provided email.');
        }
    }
    catch (error) {
        console.error('Error searching submissions:', error);
        res.status(500).send('Failed to search submissions.');
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

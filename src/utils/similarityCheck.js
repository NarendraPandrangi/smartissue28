// src/utils/similarityCheck.js
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

// This function checks if an issue with a similar title already exists.
export async function checkForSimilarIssues(newTitle) {
    try {
        // 1. Get all issues from the database
        // In a real big app, we wouldn't fetch ALL issues, but for this beginner app, it's okay.
        const issuesRef = collection(db, "issues");
        const q = query(issuesRef);
        const querySnapshot = await getDocs(q);

        // 2. Loop through each existing issue
        const similarIssues = [];
        querySnapshot.forEach((doc) => {
            const existingIssue = doc.data();
            const existingTitle = existingIssue.title;

            // 3. Compare titles
            // We convert both to lowercase to make it "case-insensitive"
            // e.g., "Login Bug" matches "login bug"
            if (existingTitle.toLowerCase().includes(newTitle.toLowerCase()) ||
                newTitle.toLowerCase().includes(existingTitle.toLowerCase())) {
                similarIssues.push(existingTitle);
            }
        });

        return similarIssues; // Return list of similar titles found

    } catch (error) {
        console.error("Error checking for similarity:", error);
        return []; // If error, assume no similar issues to avoid blocking the user
    }
}

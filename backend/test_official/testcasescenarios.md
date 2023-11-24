# **T.1 Authorization Test Case Scenarios**


## **Logging In Test Cases:**


## **T.1.1 Successful Login:**
- Valid email and password combination.
- Verify that the server responds with a 200 status and provides valid access and refresh tokens.


## **T.1.2 Invalid Credentials:**
- Invalid email.
- Invalid password.
- Verify that the server responds with a 400 status and provides an appropriate error message.


## **T.1.3 Missing Parameters:**
- Request body missing email.
- Request body missing password.
- Verify that the server responds with a 400 status and provides an appropriate error message.


## **T.1.4 Non-Existent User:**
- Attempt to login with an email that does not exist in the database.
- Verify that the server responds with a 400 status and provides an appropriate error message.


## **T.1.5 Invalid Email Format:**
- Attempt to login with an email in an invalid format.
- Verify that the server responds with a 400 status and provides an appropriate error message.


## **Logging Out Test Cases:**
## **T.1.6 Successful Logout:**
- Logout with a valid refresh token.
- Verify that the server responds with a 200 status and a confirmation message.
- Verify that the user's refresh token is set to null in the database.


## **T.1.7 Missing Refresh Token:**
- Attempt to logout without providing a refresh token.
- Verify that the server responds with a 400 status and provides an appropriate error message.


## **T.1.8 Invalid Refresh Token:**
- Logout with an invalid refresh token.
- Verify that the server responds with a 400 status and provides an appropriate error message.


## **T.1.9 Expired Refresh Token:**
- Attempt to logout with a refresh token that has expired.
- Verify that the server responds with a 400 status and provides an appropriate error message.


## **T.1.10 Logout After Changing Password:**
- Logout after changing the user's password.
- Verify that the server responds with a 200 status and a confirmation message.
- Verify that the user's refresh token is set to null in the database.


**T.2 Insert Proposal**


## **T.2.1 Valid Proposal Insertion:**
**Input:**
- Title: "AI in Autonomous Vehicles"
- Supervisor ID: [valid professor ID]
- Co-Supervisor ID: [valid co-supervisor ID]
- Keywords: "artificial intelligence, autonomous vehicles, machine learning"
- Type: "Practical Based"
- Group: "AI and Data Science"
- Description: "This thesis explores the implementation of AI in autonomous vehicles, focusing on machine learning algorithms."
- Required Knowledge: "Machine Learning, Computer Vision"
- Notes: "Please submit a brief overview of your relevant experience."
- Level: "Master's"
- Programme: "Computer Engineering"
- Deadline: [future date]
**Expected Output:**
- Proposal is successfully inserted.
- Status is set to "Active."


## **T.2.2 Invalid Supervisor ID:**
**Input:**
- Title: "Blockchain in Supply Chain”
- Supervisor ID: [invalid professor ID]
- Co-Supervisor ID: [valid co-supervisor ID]
- Other valid inputs.
**Expected Output:**
- Error message: "Invalid Supervisor ID."


## **T.2.3 Missing Required Fields:**
**Input:**
- Title: ""
- Supervisor ID: [valid professor ID]
- Other valid inputs except for required fields.
**Expected Output:**
- Error message: "Title is required."


## **T.2.4  Expired Deadline:**
**Input:**
- Title: "Renewable Energy Solutions"
- Supervisor ID: [valid professor ID]
- Other valid inputs.
- Deadline: [past date]
**Expected Output:**
- Proposal is successfully inserted, and the status is automatically set to "Archived" due to the past deadline.


## **T.2.5 Invalid Programme:**
**Input:**
- Title: "3D Printing in Construction"
- Supervisor ID: [valid professor ID]
- Other valid inputs except for an invalid programme.
**Expected Output:**
Error message: "Invalid programme."




## **T.2.6 Missing Description:**
**Input:**
- Title: "Quantum Computing"
- Supervisor ID: [valid professor ID]
- Other valid inputs except for missing description.
**Expected Output:**
Error message: "Description is required."


## **T.2.7 Inactive Status on Insertion:**
**Input:**
- Title: "Augmented Reality Applications"
- Supervisor ID: [valid professor ID]
- Other valid inputs.
- Deadline: “”
- Status: "Inactive"
**Expected Output:**
- Proposal is successfully inserted with status set to "Inactive." when the deadline is not added.


#**T.3 Search Proposal**


## **T.3.1. Valid Search Term:**
**Input**
- Search Term: "Artificial Intelligence"
**Expected Output:**
- Display a list of thesis proposals that contain the term "Artificial Intelligence" in their titles, keywords, or descriptions.


## **T.3.2 Empty Search Term:**
**Input:**
- Search Term: ""
**Expected Output:**
- Display an error message or provide a default behavior, such as showing all available thesis proposals.


## **T.3.4 No Matching Results:**
**Input:**
- Search Term: "RandomUnmatchedTerm123"
**Expected Output:**
- Display a message indicating that no matching results were found for the given search term.




## **T.3.5 Search with Special Characters:**
**Input:**
- Search Term: "Data Science & Machine Learning"
**Expected Output:**
- Handle special characters properly and display relevant results containing the term "Data Science & Machine Learning."


## **T.3.6 Search with Multiple Keywords:**
**Input:**
- Search Term: "Robotics, Automation, Control Systems"
**Expected Output:**
- Display relevant results containing any of the specified keywords.


## **T.3.7 Case-Insensitive Search:**
**Input:**
- Search Term: "cOmpUter EngIneerIng"
**Expected Output:**
- Perform a case-insensitive search and display relevant results regardless of the case of the search term.


## **T.3.8 Search with Trailing and Leading Spaces:**
**Input:**
- Search Term: " Renewable Energy "
**Expected Output:**
- Trim leading and trailing spaces from the search term and display relevant results for "Renewable Energy."


## **T.3.9 Search with Partial Word:**
**Input:**
-Search Term: "Dat"
**Expected Output:**
-Display relevant results containing words that start with or contain the letters "Dat," such as "Data Science" and "Database."


## **T.3.10 Search with Program Abbreviation:**
**Input:**
- Search Term: "ECE"
**Expected Output:**
- Display relevant results for the specified program abbreviation, such as "Electrical and Computer Engineering."


## **T.3.11 Search with Expired Proposals:**
**Input:**
- Search Term: "Renewable Energy"
**Expected Output:**
- Include relevant results even if the proposals are marked as "Archived" due to an expired deadline.


**T.4 Apply for Proposal**


## **T.4.1 Applied for Proposal:**
**Input:**
- Valid input.
**Expected Output:**
- Application is successfully submitted, and a confirmation message is displayed.


## **T.4.2 Missing Proposal Document:**
**Input:**
- Student ID: [valid student ID]
- Proposal ID: [valid proposal ID]
- Proposal Document: [missing proposal document attachment]
- CV Document: [valid CV document attachment]
**Expected Output:**
- Display an error message indicating that the proposal document is required for the application.


## **T.4.3 Invalid Proposal Document Format:**
**Input:**
- Student ID: [valid student ID]
- Proposal ID: [valid proposal ID]
- Proposal Document: [invalid proposal document format]
- CV Document: [valid CV document attachment]
**Expected Output:**
- Display an error message indicating that the CV document format is invalid.


## **T.4.4 Duplication Application with the Same Documents:**
**Input:**
- Student ID: [valid student ID]
- Proposal ID: [valid proposal ID]
- Proposal Document: [valid proposal document attachment]
- CV Document: [valid CV document attachment]
**Expected Output:**
- Display an error message indicating that the student has already applied for this proposal with the same documents.


## **T.4.5 Apply to Expired Proposal with Documents:**
**Input:**
- Student ID: [valid student ID]
- Proposal ID: [expired proposal ID]
- Proposal Document: [valid proposal document attachment]
- CV Document: [valid CV document attachment]
**Expected Output:**
- Display an error message indicating that the proposal has already expired, and applications are no longer accepted.


## **T.4.6 Apply to Archived Proposal with Documents:**
**Input:**
- Student ID: [valid student ID]
- Proposal ID: [archived proposal ID]
- Proposal Document: [valid proposal document attachment]
- CV Document: [valid CV document attachment]
**Expected Output:**
- Display an error message indicating that the proposal has been archived, and applications are no longer accepted.


#**T.5 Browse Applications**


## **T.5.1 View All Applications:**
**Input:**
- Professor ID: [valid professor ID]
**Expected Output:**
- Display a list of all applications, including relevant details such as student name, proposal title, application status, and submission date.


## **T.5.2 Filter Applications by ID:**
**Input:**
- Proposal ID: [valid proposal ID]
**Expected Output:**
- Display a filtered list of applications related to the proposal, including relevant details.


## **T.5.3 Filter Applications by Status (Accepted):**
**Input:**
- Professor ID: [valid professor ID]
- Application Status: [Accepted]
**Expected Output:**
- Display a list of applications that have been accepted, including relevant details.


## **T.5.4 Filter Applications by Status (Rejected):**
**Input:**
- Professor ID: [valid professor ID]
- Application Status: [Rejected]
**Expected Output:**
- Display a list of applications that have been rejected, including relevant details.


## **T.5.5 Filter Applications by Status (Pending):**
**Input:**
- Professor ID: [valid professor ID]
- Application Status: [Pending]
**Expected Output:**
- Display a list of applications that are still pending review, including relevant details.


## **T.5.6 Accept Application:**
**Input:**
- Professor ID: [valid professor ID]
- Application ID: [valid application ID]
**Expected Output:**
- Successfully accept the application and update the status. Display a confirmation message.


## **T.5.7 Reject Application:**
**Input:**
- Professor ID: [valid professor ID]
- Application ID: [valid application ID]
**Expected Output:**
- Successfully reject the application and update the status. Display a confirmation message.


## **T.5.8 Accept Application with Missing Required Documents:**
**Input:**
- Professor ID: [valid professor ID]
- Application ID: [application ID with missing required documents]
**Expected Output:**
- Display an error message indicating that the application cannot be accepted without the required documents.


# **T.6 Accept Application**


## **T.6.1 Accept Application:**
**Input:**
- Professor ID: [valid professor ID]
- Application ID: [valid application ID]
**Expected Output:**
- Successfully accept the application.
- Update the application status to "Accepted."
- Display a confirmation message indicating the successful acceptance of the application.

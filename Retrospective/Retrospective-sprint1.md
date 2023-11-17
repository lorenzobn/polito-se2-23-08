# RETROSPECTIVE  SPRINT #1 (Team 8)

## PROCESS MEASURES 

### Macro statistics
##### Committed stories:
- Insert Proposal: 8 points
- Search Proposals: 8 points
- Apply for proposal: 8 points
- Browse applications: 8 points
- Accept applications: 3 points

##### Number of stories  
Committed: 5  
Done: 1


##### Total points  
Committed: 35  
Done: 8

##### Nr of hours planned vs. spent (as a team)  
Planned: 114 ( 16 hours per person + 2 hours of planning at the start of the sprint )  
Spent: 118


#### Our definition of done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed
- Should run code in the containerized environment


### Detailed statistics

We are reporting data for all stories as if we completed them

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   7      |       |        21,5    |      40,5|
|_#1_   |     5    |     8   |    24,5        |  28      |
| _#2_| 5 | 8 | 14| 25 |
| _#3_ | 5 | 5 | 6,5 | 10,5 |
| _#4_ | 3 | 5 | 11 | 9 |
| _#5_ | 5 | 3 | 3 | 5 |

##### Points/issues that specifically emerge from comparison between hour estimation and actual:

- We estimated too few hours for story 0: since we are at the start of the project we should have planned more hours for this story, as it is a crucial one.
- Search Proposals (story 2) story took us a lot more time than we estimated : we underestimated the effort to implement the search functionality
- We were not realistic with the complete estimations including each task involved within one story.
- We overestimated our capacity and were too ambitious as a team.

##### Hours per task average, standard deviation (estimate and actual):
##### Estimate:
  - hours per task average: 2,74  
  - standard deviation: 1,323  
##### Actual:  
  - hours per task average: 3,75  
  - standard deviation: 1,36

##### Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1  

    -0,32
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 10
  - Total hours spent: 11
  - Nr of automated unit test cases :13

- E2E testing:
  - Total hours estimated: 2  
    We couldn't perform end-to-end and integration testing since we were not able to connect front end with back end due to Docker problems.

- Code review 
  - Total hours estimated : 1h
  - Total hours spent : 45m
  
## ASSESSMENT

**What caused your errors in estimation (if any)?**

 - Overall we didn't consider each, and every aspect of the task involved in completing the story, some functionalities were far more complex than the others.
 - For example: We didn't consider the time effort on the ***frontend*** rendering ***with backend*** functionalities for each story. We didn't properly plan the hours for this task. Therefore, we left this part last minute and in the end this resulted in taking more hours than we even had planned, right before the demo. 
  
**What lessons did you learn (both positive and negative) in this sprint?**

**Negative lessons** (the biggest one):  
- **Overestimated:** We overestimated our capabilities and were too ambitious in terms of story assignment for this sprint. 

- **Time Management:** We should get all stories done two day (at least) before the demo, so that we can leave the last day and a half for completely integrating frontend with backend, work on end to end testing, resolve all issues related to merging branches in github, and solve code conflicts.

- **Merging to Production Environment:** We also realized that ***we should merge development branches as we work, e.g. every 3 days***, and not in the last day of the sprint. In this way we can have a clear idea of what is working and what is not during the sprint, and not at the end of it - when it is too late.

- **Knowledge Debt:** We should all learn how to use docker so we could resolve all the errors pertaining to docker and run our code in containerized environment, which caused the biggest issue here as the entire project couldn't run by all team members.

- **Strategic Planning:** We have invested too much time in perfecting the aesthetics instead of ensuring the basic functionalities were working.
  
**Positive lesson**:  
- We should focus on effective and efficient communication on what has to be achieved and what is pending.
- As a team we have learned what is our capacity (velocity), which will help us plan better for the future sprints.

**Which improvement goals set in the previous retrospective were you able to achieve?**

- Keeping the daily ***scrum meetings short***: everyone talked for 2/3 minutes about updates and we didn't cover issues in the scrum meetings, but in seperate session with the members involved.
- We have strictly followed the meeting agenda.
- We had a more balanced work distribution this sprint.

**Which ones you were not able to achieve? Why?**

- We couldn't complete all the delivered stories, because of the errors that we faced due to the containerized environment. Secondly, our frontend rendering with backend was creating many issues for us.
- We lost track of the current situation on a high-level perspective, which means we couldnt evaluate effectively the improvements, work pending, and changes required for the imeplementation of the individual story.

**Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)**

- Realistic evaluation of the individual task.
- Realistically commit stories for each sprint.
- We should always have a working version of the project.

**One thing you are proud of as a Team!**

This is a blameless retrospective. We don't blame others for causig issues and we are always available to show up for a team member and help in any issues they are having. At the end of this sprint we all learned our lessons, and we know where we need to improve. 

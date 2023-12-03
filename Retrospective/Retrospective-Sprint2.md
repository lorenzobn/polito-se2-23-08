# RETROSPECTIVE  SPRINT #2 (Team 8)

## PROCESS MEASURES 

### Macro statistics
##### Committed stories:
- Insert Proposal: 13 points (spent 5)
- Search Proposals: 13 points (spent 5)
- Apply for proposal: 13 points (spent 5)
- Browse applications: 13 points (spent 5)
- Accept applications: 5 points (spent 2)

##### Number of stories  
Committed: 5  
Done: 5


##### Total points  
Committed: Overall 57 (previous 35 + re-estimation 22)  
Done: 22

##### Nr of hours planned vs. spent (as a team)  
Planned: 112 
Spent: 112.75


#### Our definition of done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed
- Dockerize each component


### Detailed statistics

We are reporting data for all stories as if we completed them

| Story  | # Tasks | Points | Hours est. (inclusive of previous sprint due to re-estimation)| Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   4 |   N/A  |  51.5 (21.5+30) |  35  |
|_#1_   |   4 |    13 |  40.5 (24.5+26) |  25  |
| _#2_|  5 | 13 | 39 (14+25)| 25|
| _#3_ | 3 | 13 | 19 (10.5+8) | 7 |
| _#4_ | 3| 13 | 16 (11+5) | 4 |
| _#5_ | 4 | 5 | 23 (5+18) | 17 |


##### Points/issues that specifically emerge from comparison between hour estimation and actual:
- In this sprint we re-estimated our stories, as in the previous sprint we underestimated it. 

##### Hours per task average, standard deviation (estimate and actual):
##### Estimate:
  - hours per task average:  3.416
  - standard deviation: 2.27
##### Actual:  
  - hours per task average: 4.7 
  - standard deviation: 2.48


##### Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1  

  - (112/112.75 - 1) = -0.006

## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 10
  - Total hours spent: 11
  - Nr of automated unit test cases :11
  - Coverage (if available): 80%

- E2E testing:
  - Total hours estimated: 12
  - We opened a total of 38/43 issues were resolved based on the priority of invalid, bugs, and then enhancement. 
             
- Code review 
  - Total hours estimated : 2
  - Total hours spent : 2
  

## ASSESSMENT

**What caused your errors in estimation (if any)?**
- In this sprint we were more realistic in terms of our estimation, because we realized the capacity (or velocity as team)
  
**What lessons did you learn (both positive and negative) in this sprint?**

**Negative lesson** (the biggest one):  
- We started to implement essential requirements e.g. the virtual clock towards the end of the sprint, which was a risk as a team.

**Positive lesson**:  
- We did a rigorous end to end to test check if every component is working. And all the bugs, invalid requirements, and enhancement found in the E2E testing was effectively communicated to the team and re-implemented.

**Which improvement goals set in the previous retrospective were you able to achieve?**
- We set and respected the internal deadlines as a team.
- We merged and resolved the merge conflicts in the branches regularly.
- We did a thorough E2E testing to check everything is working locally and with docker. 

**Which ones you were not able to achieve? Why?**
- Not applicable.

**Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)**
- As a team we should consider all the intersecting components such as a virtual-clock at the start of the sprint to ensure that it's being implemented.

**One thing you are proud of as a Team!!**
- The team continously resolved the github issues that were opened during the E2E testing, and the team strategically prioritized bugs, invalid tagged issues over the enhancement, however, we were still able to complete even the enhancement suggestion. 

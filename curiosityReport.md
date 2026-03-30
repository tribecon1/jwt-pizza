# Curiosity Report: Version Control Options and Comparison

---

## Brief Overview: What is “Version Control”?
- Version control, specifically applied to software development, is meany to allow both individuals and teams work on a source of code without overwriting and losing previous versions, allowing the viewer to see comparative changes to the source code and who made those changes, allowing you to revert between different versions of the source code as needed. This allows those interacting with the shared code to safely make changes without permanently destroying past versions or losing functional code.

---

## Git and GitHub: The World’s Most Popular Option
- Git, the local version of GitHub, was created in April 2005 as the open-source alternative to the proprietary “BitKeeper” in order to help Linus Torvalds manage his totally-separate and large-scale project with others building the Linux kernel! 3 years later, the web-hosted version GitHub became available.

### Key Aspects:

#### Stages of Version Control:
1. **Working Directory**
   - The project/repository you have initialized as being managed and tracked by GitHub

2. **Staged Changes**
   - Any changes made to the files within your repository that you want to be grouped together as changes to the database are added to an intermediate staging area.

3. **Committed Changes**
   - After the group of changes have been completed and are ready to update the codebase, they are committed together to the codebase as the latest “historical snapshot” and version of the codebase. You can view previous commits and the code at that time for a comparative history and return to previous versions

#### A Few Strategies for Merging Branches of Changed Code:

- **The “ort” Strategy = “Ostensibly Recursive’s Twin”**
  - This is GitHub’s default strategy that improves upon the former “recursive” strategy that uses a recursive algorithm comparing the branch being merged into, the branch merged from, and their “nearest common ancestor” to expertly merge the code together. The improvements in this strategy are defined in how it leverages caching to store and retrieve the mini-merges required for the large-scale merge.

- **The “octopus” Strategy**
  - A strategy used when merging multiple branches into one, requiring that there be absolutely no conflicts with the changed code, so as to keep a cleaner history of the codebase and have a singular merge rather than several individual 1:1 merges.

- **The “ours” Strategy**
  - This algorithm also exists to help improve the version history for legibility, as it brings in 1+ branches into another to show that they all converge and share history, but it strictly preserves the code existing in branch being merged into.

---

## Alternative Version Control Options and Their Comparative Attributes:
- Virtually all competitors to GitHub as a version control manager and more are built on Git, so they share the same merging strategies. Their differences lie in their supporting technologies and their business rules in enforcing Git version control. Different version control systems exist, like Mercurial, designed to function the same but in a more user-friendly manner, or Perforce Helix Core, meant for large files common in codebases for gaming, but with Git at ~80%+ market share, it is the dominant option.

### GitLab:
- While GitLabs is built on top of Git as well, GitLabs made a name for itself in directly incorporating CI/CD pipeline tools as part of its primary product before GitHub Actions was created, and along with its option to self-host for greater security and control, it cements itself as a competing alternative for enterprise-level companies that want total control over a well-defined integration and deployment pipeline.
- It also requires that any branches of differing code must be updated with the code of the current main branch before its new/changed code can be merged in, which simplifies the version history to just point to the latest addition to the main branch, as all things prior are enforced to be consistent.

### Bitbucket:
- Bitbucket, owned by Atlassian, is an alternative because of its position with the Atlassian ecosystem for other popular DevOps tools built by Atlassian like Jira and Trello, allowing your version control system to directly integrate with submitted issue tickets and feature requests as branches to your codebase, along with advancing/resolving those with the consequential merges.

### Azure DevOps:
- While Microsoft owns and advances GitHub, it also supports its infrastructure platform Azure’s product “DevOps,” which has the unique value prop of being designed to support incredibly large projects stored in a monorepo, using a “Virtual File System” when users interact with the massive repo locally, so as to avoid having to store the entire repository and its versions locally.

---

## How This Relates to DevOps and QA:
- In order to allow for teams to collaborate cleanly and clearly, there must be a way to keep track of what was done and what is being changed by whom. For DevOps specifically, it allows their teams to identify when newly added code introduced a breaking change, failing the CI tests for when it’s staged in a pull/merge request into the main/production branch. Additionally, it gives a platform for the latest version of code from which the DevOps team can implement CD and deploy their code to the infrastructure hosting/running the product.

---

## Why I Chose This:
- I personally have only ever used and been exposed to Git and GitHub as options for version control management, and I could not help but wonder what would persuade someone to choose anything different. Additionally, there are so many Git commands that I see but do not use or understand that I now have a greater understanding of, like “squash” compacting several small commits on a branch to a singular, compact one, allowing for a cleaner history, and also rebasing the main branch, applying the commits you committed to a feature branch into the timeline of the main branch. Overall, I learned that version control is not just a tool used by developers and DevOps to keep track of code as its changed and tested automatically, but also to provide a clear, readable history for the codebase to be reviewed. I learned that many of the strategies implemented by GitHub and its competitors goes beyond simply “working” to get code merged together, but to ensure that as it is done, the history is clear and easy to read.

---

## My Experiment w/ GitLab:
- To experiment with an alternative version control system, I wanted to check out GitLabs and better understand what their take on CI/CD pipelines/actions looked as a fundamental part of their platform as opposed to GitHub's later addtion of Actions. To do so, I created a GitLab account and created a project and repository within it:

![GitLab Project Main Page](/public/GitLabMainPage.png)

### Pros:

![GitLab CI Pipeline Creator](/public/GitLabCIPipeline.png)

- I like the ability to cleanly create, visualize, and even validate pipelines directly in GitLab. The traditional flow for GitHub in my experience has been creating the `.yaml` file somewhat blind and then finding out the results after the fact, depending on the trigger action. 
- I appreciate the organization of projects and repositories belonging to that project for better and clearer organization.
- I also like their clear distinction between building CI pipelines/jobs in the "Build" section while also have a separate section dedicated to deploying your repository code to your production environment/infrastructure through the "Deploy" section.

### Cons:

![GitLab CI Pipeline View](/public/GitLabPipeline.png)

![GitLab CI Jobs View](/public/GitLabJobs.png)

- I felt like it was very difficult to find the rerun feature for a pipeline, mainly because of the separation GitLab makes between pipelines and jobs of those pipelines. I feel like those should be hierarchical and also allow you to rerun an entire pipeline, similar to how GitHub Actions lets you view the collective jobs of a pipeline and rerun some or all of them directly from that view, not at each individual job level.
- Additionally, the entry point to your repository's code being different between clicking on your repo name vs. 

### Conclusion:
- I do not feel like there is a significant enough pull/difference in functionality and capabilities to switch from GitHub to GitLab. I *do* appreciate the cognitive support in having separate and distinct sections for CI and CD, along with projects and repos, but all in all it would just be learning a different UI and interface to achieve the same functionality, so I don't know that I will be switching my version control system of choice any time soon.

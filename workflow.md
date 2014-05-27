# Parascript Sprint.ly Workflow

## Story Format

#### Title:
Feature description with business value

#### Content Template:
- Outstanding Questions (Need to be resolved before moving to backlog)
- Technical Guidance & other non-feature requirements
- Gherkin Scenario(s)
- Attached Design Comp

#### Tags:
- Tag stories to an appropriate “epic” (e.g. reports, multi-selection, organization, list-view, etc.)
- Tag stories needing design attention with “design”?
- Tag stories with unanswered questions with "questions"?

#### Comments:
- Use comments for smaller clarification, documenting problems, and status.
- Mention Dave for design questions
- Mention Hargobind for technical questions

## Story Progression

#### Someday:
- Any stories needing further clarification should be in someday
- Outstanding questions regarding functionality, acceptance criteria, or design should be documented in the story, and resolved before moving to the backlog.

#### Backlog:
- Stories should be ready for implementation (barring dependency issues).
- Stories should have a clear definition of “done”.

#### Current:
- Stories are in progress
- Minimize number of stories in progress
- Stories should remain in current until they have been merged.
- Mention the sprint.ly item in the pull request with the format “Closes item:42”

#### Complete:
- Complete stories should be on master and ready for deploy to staging for review by Greg and/or Donald.

#### Accepted:
- Accepted stories have been reviewed by Greg or Donald.

## Git(Hub) Workflow

#### Branches:
- Name branches based on sprint.ly item number and a brief description (e.g. “128-filter-date”)
- Use hyphens in names
- Branch off of master whenever possible

#### Pull Requests:
- Merge or rebase master prior to opening a pull request.
- Run the tests!

#### Pull Request Template:

	#### What's this PR do?
	#### Where should the reviewer start?
	#### Any background context you want to provide?
	#### What are the relevant tickets?
	#### Screenshots (if appropriate)
	#### Setup Requirements (new dependencies, migrations, configuration, etc.)
	#### Definition of Done:
	- [ ] Meets Acceptance Criteria (Requirements and Scenarios).
	- [ ] Tests pass!
	- [ ] Tests for any new functionality (unit, e2e)?
	- [ ] Check test coverage (lines, branches). Sad path, happy path, edge case etc.
	- [ ] Regression tests for any defects?
	- [ ] Readme updated to cover any new setup?
	- [ ] Up to date with master?
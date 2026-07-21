# Feature Ideas for Codinger

## Current product snapshot

Codinger already has a strong base for a browser-based learning platform:

- Learning paths, units, and Markdown-authored lessons
- Monaco and Sandpack-powered coding exercises
- Automated tests embedded in lesson content
- User accounts, password management, and passkeys
- Lesson completion tracking and progress displays for units and paths
- A continue-learning flow for the selected learning path
- Dedicated lesson pages with outlines and previous/next navigation
- Beginner-friendly AI guidance for failed exercise tests
- Installable web-app metadata

The remaining ideas focus on improving feedback, course structure, project-based
learning, motivation, and content-authoring workflows.

## Recommended priorities

| Priority | Feature                     | Benefit                                                                    | Estimated effort |
| -------- | --------------------------- | -------------------------------------------------------------------------- | ---------------- |
| 1        | Progressive hints           | Offer increasingly specific help without immediately revealing the answer  | Small–medium     |
| 2        | Capstone projects           | Combine multiple concepts in realistic, multi-file projects                | Large            |
| 3        | Placement quiz              | Allow experienced learners to skip material they already understand        | Medium           |
| 4        | Review mode                 | Resurface weak or previously failed concepts using spaced repetition       | Medium           |
| 5        | Prerequisites and skill map | Show concept dependencies and demonstrated mastery across learning paths   | Large            |
| 6        | Accessibility coach         | Make accessible development a recurring part of exercises and projects     | Medium           |
| 7        | Authoring validation        | Catch invalid exercises, duplicate IDs, and broken links before publishing | Medium           |

## Better exercise feedback

### Progressive hints

Exercises could define two or three hints in Markdown frontmatter or the exercise
directive:

1. A conceptual reminder
2. A more specific suggestion
3. A small code-shaped example

Hints could unlock after a failed attempt or remain learner-controlled. Tracking
hint use may help identify confusing exercises.

### Reset, compare, and reflect

Useful exercise actions include:

- Reset to starter code
- View a diff from the starter code
- Re-run only a failed test
- Explain a test in plain language
- View an example solution after passing
- Write a short reflection on what was learned

## Course improvements

### Prerequisites and a skill map

Model concepts such as semantic HTML, selectors, events, and components as skills.
Show their dependencies in a map spanning HTML, CSS, JavaScript, TypeScript, and
React. Lessons and exercises can award mastery toward one or more skills.

This provides more useful guidance than course completion alone: a learner can
see both what they finished and what they can now do.

### Placement and mastery checks

Offer a short diagnostic when a learner starts a path. Correct answers can mark
introductory skills as mastered, while incorrect answers guide the learner toward
the relevant material. End-of-unit mastery checks can verify retention rather
than relying only on lesson completion.

### Review mode

Create short review sessions from exercises that a learner failed, solved with
several hints, or has not revisited recently. A five-minute daily review is a
natural use of the existing exercise system.

## Project-based learning

### Capstone projects

Add multi-file projects that combine several lessons. Possible projects include:

- A personal profile page
- A responsive event website
- A quiz application
- A task tracker
- A small portfolio built with React

Projects should have milestones and broad acceptance tests while leaving room for
creative choices. Completed projects could be published to a learner profile.

### Visual challenge mode

Show a target design and ask the learner to recreate it with HTML and CSS. Assess
both structural requirements and visual similarity. This would complement the
current test-driven exercises and make CSS learning more engaging.

### Accessibility coach

Include automated checks and explanations for:

- Alternative text
- Form labels
- Heading order
- Semantic elements
- Keyboard navigation
- Color contrast

Accessibility could become a recurring part of every project instead of a single
isolated lesson.

## Community ideas

### Solution gallery

After passing an exercise, learners could browse several valid solutions and see
short explanations of their trade-offs. Submissions should be opt-in and
moderated before appearing publicly.

### Code replay

Record meaningful editor snapshots and replay how a solution developed. This can
help learners reflect on their process and understand where they became stuck.

### Optional Socratic tutor

An assistant could use the current lesson, starter code, learner code, and failed
tests to ask guiding questions. It should default to hints and explanations rather
than generating the finished solution. Usage limits and a non-AI fallback would
keep the learning experience dependable and affordable.

## Motivation features

Motivation systems should reward genuine learning instead of encouraging empty
clicks. Suitable options include:

- Weekly goals based on completed exercises or review sessions
- A gentle activity streak with grace days
- Skill badges tied to demonstrated mastery
- A personal timeline of completed projects
- Optional daily five-minute challenges

Leaderboards are less suitable as a default because they can discourage learners
who start later or need more time. If added, they should be opt-in and emphasize
personal improvement.

## Authoring and maintenance tools

Codinger's Markdown-based content pipeline could be extended with:

- A local exercise preview command
- Frontmatter and exercise-directive schema validation
- Automatic execution of all embedded exercise tests in CI
- Detection of duplicate IDs and broken internal links
- Draft and published lesson states
- Estimated duration and prerequisite metadata
- Content versioning so changed exercises do not invalidate old submissions
- Analytics for failure rate, hint usage, abandonment, and common wrong answers

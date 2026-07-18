# Feature Ideas for Codinger

## Current product snapshot

Codinger already has a strong base for a browser-based learning platform:

- Learning paths, units, and Markdown-authored lessons
- Monaco and Sandpack-powered coding exercises
- Automated tests embedded in lesson content
- User accounts, password management, and passkeys
- A selected current learning path
- Installable web-app metadata

The most important missing piece is a persistent learning loop. The application
currently remembers a user's selected path, but it does not record lesson
progress, exercise submissions, completion, or editor contents. Adding that
foundation would enable many of the highest-value features below.

## Recommended priorities

| Priority | Feature | Benefit | Estimated effort |
| --- | --- | --- | --- |
| 1 | Progress tracking | Record completed lessons and exercises and display progress for each unit and path | Medium |
| 2 | Continue-learning dashboard | Return learners directly to their last lesson or unfinished exercise | Small |
| 3 | Autosaved code | Preserve editor contents across refreshes and devices | Medium |
| 4 | Friendly test feedback | Translate raw failures into clear, beginner-friendly explanations | Medium |
| 5 | Progressive hints | Offer increasingly specific help without immediately revealing the answer | Small–medium |
| 6 | Dedicated lesson pages | Add previous/next navigation and a lesson sidebar instead of one large accordion | Medium |
| 7 | Capstone projects | Combine multiple concepts in realistic, multi-file projects | Large |
| 8 | Placement quiz | Allow experienced learners to skip material they already understand | Medium |
| 9 | Review mode | Resurface weak or previously failed concepts using spaced repetition | Medium |
| 10 | Classroom features | Let teachers create classes, assign units, and monitor learner progress | Large |

## Foundational learning loop

### Progress and completion

Add records such as `LessonProgress` and `ExerciseSubmission`, associated with a
user and lesson or exercise. These could store:

- Status: not started, in progress, or completed
- Last visited time
- Most recently edited code
- Attempt count
- Last test result
- Completion time

This would support progress bars on unit and learning-path cards, completion
indicators in lesson navigation, and a useful home dashboard.

### Continue learning

Make the primary dashboard action a prominent **Continue learning** button. It
should open the learner's most recently active incomplete lesson and, ideally,
restore the last open exercise and its code.

### Autosave and submissions

Autosave locally for immediate resilience, then synchronize authenticated users'
work to the database. A learner should be able to refresh the page, switch
devices, or leave for a week without losing their solution.

Keeping selected successful and unsuccessful submissions would also enable
review, teacher feedback, and learning analytics later.

## Better exercise feedback

### Error translator

Convert low-level test failures into explanations aimed at beginners. Examples:

- "Your image needs an `alt` attribute."
- "The heading exists, but its text does not match the requested text."
- "This opening tag does not have a matching closing tag."
- "This CSS selector does not match anything on the page."
- "This variable is being used before it has been declared."

Where possible, the editor should highlight the relevant line. Feedback should
explain the issue without providing the complete solution.

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

## Course and navigation improvements

### Dedicated lesson runner

Move from unit-wide accordion content to a focused lesson view with:

- A collapsible lesson outline
- Previous and next buttons
- Completion state
- Estimated lesson duration
- A sticky exercise/status area
- A clear return path to the unit overview

This should make longer courses easier to navigate and give every lesson a stable,
shareable URL.

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

## Community and classroom ideas

### Solution gallery

After passing an exercise, learners could browse several valid solutions and see
short explanations of their trade-offs. Submissions should be opt-in and
moderated before appearing publicly.

### Code replay

Record meaningful editor snapshots and replay how a solution developed. This can
help learners reflect on their process and let teachers understand where someone
became stuck without watching them live.

### Classroom mode

Because Codinger was motivated by helping peers keep up with school lessons, a
classroom mode fits the product especially well. Teachers could:

- Create a class and invite learners with a code
- Assign paths, units, or individual exercises
- Set optional due dates
- View aggregate and individual progress
- Identify tests or concepts that commonly cause difficulty
- Leave feedback on a submission

Privacy should be designed in from the start: learners should know exactly what
teachers can see.

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
improvement or classroom collaboration.

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

These tools would make adding HTML, CSS, JavaScript, TypeScript, and React content
safer and faster.

## Suggested release sequence

### Release 1: Persistent progress

- Lesson and exercise progress models
- Completion controls
- Path and unit progress indicators
- Continue-learning dashboard

### Release 2: Resilient exercises

- Autosaved editor state
- Submission history
- Reset and starter-code diff
- Friendly failure messages

### Release 3: Guided learning

- Progressive hints
- Dedicated lesson navigation
- Unit mastery checks
- Review queue

### Release 4: Applied learning

- One polished multi-file capstone
- Project milestones
- Accessibility checks
- Shareable project result

### Release 5: Classroom pilot

- Class creation and invitations
- Assignments
- Teacher progress overview
- Submission feedback

This order builds the data foundation first, improves the core exercise experience
next, and delays larger social features until Codinger can reliably measure an
individual learner's progress.

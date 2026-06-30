export type LessonDraft = {
  id: number
  title: string
  content: string
}

export type UnitDraft = {
  id: number
  title: string
  description?: string
  lessons: LessonDraft[]
}

export type PathDraft = {
  id: number
  title: string
  description?: string
  units: UnitDraft[]
}

export const paths: PathDraft[] = [
  {
    id: 1,
    title: "HTML & CSS",
    description:
      "HTML and CSS are the foundational technologies that power the web. HTML provides the structure of web pages, while CSS is used to control layout, colors, fonts, and more. This path will teach you the basics of HTML and CSS. Once you finished this course, you will be able to create static web pages.",
    units: [
      {
        id: 1,
        title: "HTML Basics",
        description: "Learn the basics of HTML, including how to create headings, paragraphs, lists, links, and images.",
        lessons: [
          {
            id: 1,
            title: "Introduction to HTML",
            content:
              "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages. HTML describes the structure of a web page using a series of elements and tags.",
          },
        ],
      },
    ],
  },
]
import { Chapter } from "database/src/drizzle/schema/chapter"

type Props = {
  chapters: Chapter[]
}

export const ChapterList = ({ chapters }: Props) => {
  return (
    <div>
      {chapters.map((chapter) => (
        <div key={chapter.id}>
          <h2>{chapter.title}</h2>
        </div>
      ))}
    </div>
  )
}

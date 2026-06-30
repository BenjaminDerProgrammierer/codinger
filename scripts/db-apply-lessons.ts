// Development Tool. This is AI Slop.

import "dotenv/config"
import { prisma } from "../src/lib/prisma"
import { paths } from "./courses"

async function syncPath(path: (typeof paths)[number]) {
  await prisma.learningPath.upsert({
    where: { id: path.id },
    update: {
      title: path.title,
      description: path.description ?? null,
    },
    create: {
      id: path.id,
      title: path.title,
      description: path.description ?? null,
    },
  })

  const existingUnits = await prisma.unit.findMany({
    where: { learningPathId: path.id },
    select: { id: true },
  })
  const existingUnitIds = existingUnits.map((unit) => unit.id)
  const nextUnitIds: number[] = []

  for (const unit of path.units) {
    nextUnitIds.push(unit.id)

    await prisma.unit.upsert({
      where: { id: unit.id },
      update: {
        title: unit.title,
        description: unit.description ?? null,
        learningPathId: path.id,
      },
      create: {
        id: unit.id,
        title: unit.title,
        description: unit.description ?? null,
        learningPathId: path.id,
      },
    })

    const existingLessons = await prisma.lesson.findMany({
      where: { unitId: unit.id },
      select: { id: true },
    })
    const existingLessonIds = existingLessons.map((lesson) => lesson.id)
    const nextLessonIds: number[] = []

    for (const lesson of unit.lessons) {
      nextLessonIds.push(lesson.id)

      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: {
          title: lesson.title,
          content: lesson.content,
          unitId: unit.id,
        },
        create: {
          id: lesson.id,
          title: lesson.title,
          content: lesson.content,
          unitId: unit.id,
        },
      })
    }

    const lessonIdsToDelete = existingLessonIds.filter((lessonId) => !nextLessonIds.includes(lessonId))

    if (lessonIdsToDelete.length > 0) {
      await prisma.lesson.deleteMany({
        where: { id: { in: lessonIdsToDelete } },
      })
    }
  }

  const unitIdsToDelete = existingUnitIds.filter((unitId) => !nextUnitIds.includes(unitId))

  if (unitIdsToDelete.length > 0) {
    await prisma.lesson.deleteMany({
      where: { unitId: { in: unitIdsToDelete } },
    })

    await prisma.unit.deleteMany({
      where: { id: { in: unitIdsToDelete } },
    })
  }
}

async function deletePathIfUnused(pathId: number) {
  const userCount = await prisma.user.count({
    where: { currentPathId: pathId },
  })

  if (userCount > 0) {
    console.log(`Skipping path ${pathId}; ${userCount} user(s) still reference it.`)
    return
  }

  const unitIds = (
    await prisma.unit.findMany({
      where: { learningPathId: pathId },
      select: { id: true },
    })
  ).map((unit) => unit.id)

  if (unitIds.length > 0) {
    await prisma.lesson.deleteMany({
      where: { unitId: { in: unitIds } },
    })
  }

  await prisma.unit.deleteMany({
    where: { learningPathId: pathId },
  })

  await prisma.learningPath.delete({
    where: { id: pathId },
  })

  console.log(`Removed unused path ${pathId}`)
}

async function main() {
  await prisma.$transaction(async () => {
    for (const path of paths) {
      await syncPath(path)
    }

    const catalogPathIds = paths.map((path) => path.id)
    const missingPaths = await prisma.learningPath.findMany({
      where: { id: { notIn: catalogPathIds } },
      select: { id: true },
    })

    for (const path of missingPaths) {
      await deletePathIfUnused(path.id)
    }
  })

  console.log(`Applied ${paths.length} learning path(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
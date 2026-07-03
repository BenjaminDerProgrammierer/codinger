import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';
import {
  LearningPathCreateManyInput,
  LessonCreateManyInput,
  UnitCreateManyInput,
} from '@/generated/prisma/internal/prismaNamespaceBrowser';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const paths: LearningPathCreateManyInput[] = [];
const units: Array<UnitCreateManyInput & { pathIndex: number }> = [];
const lessons: Array<LessonCreateManyInput & { unitIndex: number }> = [];

for (const dir of fs.readdirSync(CONTENT_DIR)) {
  const dirPath = path.join(CONTENT_DIR, dir);
  if (fs.statSync(dirPath).isDirectory()) {
    const indexPath = path.join(dirPath, 'index.md');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      const title = readFrontmatterValue(content, 'title') || 'Untitled Path';
      const description = readFrontmatterValue(content, 'description');
      paths.push({ title, description });
    }

    // read units (subdirectories)
    for (const unitDir of fs.readdirSync(dirPath)) {
      const unitDirPath = path.join(dirPath, unitDir);
      if (fs.statSync(unitDirPath).isDirectory()) {
        const unitIndexPath = path.join(unitDirPath, 'index.md');
        if (fs.existsSync(unitIndexPath)) {
          const content = fs.readFileSync(unitIndexPath, 'utf-8');
          const title =
            readFrontmatterValue(content, 'title') || 'Untitled Unit';
          const description = readFrontmatterValue(content, 'description');
          units.push({
            title,
            description,
            learningPathId: 0,
            pathIndex: paths.length - 1,
          });
        }

        // read lessons (subfiles of units)
        for (const lessonFile of fs.readdirSync(unitDirPath)) {
          const lessonFilePath = path.join(unitDirPath, lessonFile);
          if (
            fs.statSync(lessonFilePath).isFile() &&
            lessonFile.endsWith('.md') &&
            lessonFile !== 'index.md'
          ) {
            const content = fs.readFileSync(lessonFilePath, 'utf-8');
            const title =
              readFrontmatterValue(content, 'title') || 'Untitled Lesson';
            lessons.push({
              title,
              content: stripFrontmatter(content),
              unitId: 0,
              unitIndex: units.length - 1,
            });
          }
        }
      }
    }
  }
}

function readFrontmatterValue(content: string, key: string): string | null {
  const frontmatterMatch = content.match(/---\s*([\s\S]*?)\s*---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const keyMatch = frontmatter.match(new RegExp(`${key}:\\s*(.*)`));
    return keyMatch ? keyMatch[1].trim() : null;
  }
  return null;
}

function stripFrontmatter(content: string): string {
  return content.replace(/---\s*([\s\S]*?)\s*---/, '').trim();
}

console.log('Paths:', paths);
console.log('Units:', units);
console.log('Lessons:', lessons);

async function main() {
  await prisma.lesson.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.learningPath.deleteMany();

  const createdPaths = [];
  for (const pathData of paths) {
    createdPaths.push(await prisma.learningPath.create({ data: pathData }));
  }

  const createdUnits = [];
  for (const unitData of units) {
    const { pathIndex, ...data } = unitData;
    createdUnits.push(
      await prisma.unit.create({
        data: { ...data, learningPathId: createdPaths[pathIndex].id },
      })
    );
  }

  for (const lessonData of lessons) {
    const { unitIndex, ...data } = lessonData;
    await prisma.lesson.create({
      data: { ...data, unitId: createdUnits[unitIndex].id },
    });
  }

  console.log('Database updated successfully.');
}

main();

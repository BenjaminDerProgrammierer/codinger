import fs from 'fs';
import path from 'path';
import { prisma } from '../src/lib/prisma';

const CONTENT_DIR = path.join(process.cwd(), 'content');

type PathEntry = { slug: string; title: string; description: string | null };
type UnitEntry = {
  slug: string;
  title: string;
  description: string | null;
  pathSlug: string;
};
type LessonEntry = {
  slug: string;
  title: string;
  content: string;
  unitSlug: string;
};

const paths: PathEntry[] = [];
const units: UnitEntry[] = [];
const lessons: LessonEntry[] = [];

for (const dir of fs.readdirSync(CONTENT_DIR)) {
  const dirPath = path.join(CONTENT_DIR, dir);
  if (fs.statSync(dirPath).isDirectory()) {
    const pathSlug = dir;
    const indexPath = path.join(dirPath, 'index.md');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      const title = readFrontmatterValue(content, 'title') || 'Untitled Path';
      const description = readFrontmatterValue(content, 'description');
      paths.push({ slug: pathSlug, title, description });
    }

    // read units (subdirectories)
    for (const unitDir of fs.readdirSync(dirPath)) {
      const unitDirPath = path.join(dirPath, unitDir);
      if (fs.statSync(unitDirPath).isDirectory()) {
        const unitSlug = `${pathSlug}/${unitDir}`;
        const unitIndexPath = path.join(unitDirPath, 'index.md');
        if (fs.existsSync(unitIndexPath)) {
          const content = fs.readFileSync(unitIndexPath, 'utf-8');
          const title =
            readFrontmatterValue(content, 'title') || 'Untitled Unit';
          const description = readFrontmatterValue(content, 'description');
          units.push({ slug: unitSlug, title, description, pathSlug });
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
            const lessonSlug = `${unitSlug}/${lessonFile.replace(/\.md$/, '')}`;
            lessons.push({
              slug: lessonSlug,
              title,
              content: stripFrontmatter(content),
              unitSlug,
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

async function main() {
  for (const pathData of paths) {
    await prisma.learningPath.upsert({
      where: { slug: pathData.slug },
      create: pathData,
      update: {
        title: pathData.title,
        description: pathData.description,
      },
    });
  }

  for (const unitData of units) {
    const { pathSlug, ...data } = unitData;
    await prisma.unit.upsert({
      where: { slug: data.slug },
      create: {
        ...data,
        learningPath: { connect: { slug: pathSlug } },
      },
      update: {
        title: data.title,
        description: data.description,
        learningPath: { connect: { slug: pathSlug } },
      },
    });
  }

  for (const lessonData of lessons) {
    const { unitSlug, ...data } = lessonData;
    await prisma.lesson.upsert({
      where: { slug: data.slug },
      create: {
        ...data,
        unit: { connect: { slug: unitSlug } },
      },
      update: {
        title: data.title,
        content: data.content,
        unit: { connect: { slug: unitSlug } },
      },
    });
  }

  // Prune content whose source file was removed, children first to respect FKs.
  await prisma.lesson.deleteMany({
    where: { slug: { notIn: lessons.map((l) => l.slug) } },
  });
  await prisma.unit.deleteMany({
    where: { slug: { notIn: units.map((u) => u.slug) } },
  });
  await prisma.learningPath.deleteMany({
    where: { slug: { notIn: paths.map((p) => p.slug) } },
  });

  console.log('Database updated successfully.');
}

main();

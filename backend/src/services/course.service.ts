import { prisma } from "../config/prisma";
import { CourseCreateDTO, CourseResponse } from "../modules/course/course.types";

class ConflictError extends Error {
  statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class CourseService {
  async createCourse(dto: CourseCreateDTO): Promise<CourseResponse> {
    const existing = await prisma.course.findFirst({ where: { title: dto.title } });
    if (existing) throw new ConflictError("Course with this title already exists");

    const created = await prisma.$transaction(async (tx) =>
      tx.course.create({
        data: {
          title: dto.title,
          description: dto.description ?? null,
          imageUrl: dto.imageUrl ?? null,
          isPublished: dto.isPublished,
          createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
          updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
          modules: {
            create: dto.modules?.map((m) => ({
              title: m.title,
              order: m.order,
              createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
              contents: {
                create: m.contents?.map((c) => ({
                  type: c.type,
                  title: c.title ?? null,
                  content: c.content ?? null,
                  url: c.url ?? null,
                  order: c.order,
                })),
              },
              quizzes: {
                create: m.quizzes?.map((q) => ({
                  title: q.title,
                  isGeneratedByAI: q.isGeneratedByAI ?? undefined,
                  questions: {
                    create: q.questions?.map((qq) => ({
                      text: qq.text,
                      reactives: {
                        create: qq.reactives?.map((r) => ({
                          text: r.text,
                          isCorrect: r.isCorrect ?? false,
                        })),
                      },
                    })),
                  },
                })),
              },
              simulation: m.simulation
                ? {
                    create: {
                      title: m.simulation.title,
                      content: m.simulation.content,
                      passingScore: m.simulation.passingScore,
                    },
                  }
                : undefined,
            })),
          },
        },
        include: {
          modules: {
            include: {
              contents: true,
              quizzes: { include: { questions: { include: { reactives: true } } } },
              simulation: true,
            },
          },
        },
      })
    );
    // hellish mapping to convert Date to string and fit the CourseResponse type
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      imageUrl: created.imageUrl,
      isPublished: created.isPublished,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      modules: created.modules.map((m) => ({
        id: m.id,
        title: m.title,
        order: m.order,
        createdAt: m.createdAt.toISOString(),
        contents: m.contents.map((c) => ({
          id: c.id,
          type: c.type,
          title: c.title,
          content: c.content,
          url: c.url,
          order: c.order,
          })),
        quizzes: m.quizzes.map((q) => ({
          id: q.id,
          title: q.title,
          isGeneratedByAI: q.isGeneratedByAI,
          questions: q.questions.map((qq) => ({
            id: qq.id,
            text: qq.text,
            reactives: qq.reactives.map((r) => ({
              id: r.id,
              text: r.text,
              isCorrect: r.isCorrect,
            })),
          })),
        })),
        simulation: m.simulation
          ? {
              id: m.simulation.id,
              title: m.simulation.title,
              content: m.simulation.content,
              passingScore: m.simulation.passingScore,
            }
          : undefined,
      })),
    };
  }

  async getAllCourses(): Promise<CourseResponse[]> {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            contents: true,
            quizzes: { include: { questions: { include: { reactives: true } } } },
            simulation: true,
          },
        },
      },
    });
    // hellish mapping to convert Date to string and fit the CourseResponse type
    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      isPublished: course.isPublished,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      modules: course.modules.map((m) => ({
        id: m.id,
        title: m.title,
        order: m.order,
        createdAt: m.createdAt.toISOString(),
        contents: m.contents.map((c) => ({
          id: c.id,
          type: c.type,
          title: c.title,
          content: c.content,
          url: c.url,
          order: c.order,
        })),
        quizzes: m.quizzes.map((q) => ({
          id: q.id,
          title: q.title,
          isGeneratedByAI: q.isGeneratedByAI,
          questions: q.questions.map((qq) => ({
            id: qq.id,
            text: qq.text,
            reactives: qq.reactives.map((r) => ({
              id: r.id,
              text: r.text,
              isCorrect: r.isCorrect,
            })),
          })),
        })),
        simulation: m.simulation
          ? {
              id: m.simulation.id,
              title: m.simulation.title,
              content: m.simulation.content,
              passingScore: m.simulation.passingScore,
            }
          : undefined,
      })),
    }));
  }

  async searchCoursesByName(name: string) {
    const courses = await prisma.course.findMany({
      where: {
        title: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      isPublished: course.isPublished,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    }));
  }

  async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!course) return null;
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl,
      isPublished: course.isPublished,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
  }

}

export const courseService = new CourseService();
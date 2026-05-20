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
          duration: dto.duration ?? null,
          type: dto.type ?? "TECHNICAL",
          regulations: dto.regulations ? { connect: dto.regulations.map(id => ({ id })) } : undefined,
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
                    passingScore: m.simulation.passingScore,
                    configuration: {
                      scenario: "Terminal de Gasoductos Sempra",
                      imageUrl: "placeholder-sempra-terminal",
                      timeLimitSeconds: 120,
                      hotspots: [
                        {
                          id: "h1",
                          type: "OIL_SPILL",
                          riskType: "Derrame de Aceite",
                          name: "Derrame de Aceite",
                          x: 25,
                          y: 80,
                          radius: 10,
                          penaltyPoints: 25,
                          justification: "Los derrames en el piso son una de las causas más frecuentes de accidentes por resbalones y caídas. Además, representan un riesgo grave de incendio o contaminación."
                        },
                        {
                          id: "h2",
                          type: "NO_PPE",
                          riskType: "Falta de EPP (Casco)",
                          name: "Falta de EPP (Casco)",
                          x: 37,
                          y: 46,
                          radius: 8,
                          penaltyPoints: 25,
                          justification: "El uso de Equipo de Protección Personal (EPP) es mandatorio en áreas operativas. La ausencia de casco expone al trabajador a traumatismos craneoencefálicos por caída de herramientas o materiales."
                        },
                        {
                          id: "h3",
                          type: "EXPOSED_CABLES",
                          riskType: "Cables Expuestos",
                          name: "Cables Expuestos",
                          x: 80,
                          y: 55,
                          radius: 12,
                          penaltyPoints: 25,
                          justification: "El cableado eléctrico expuesto fuera de su canalización o panel cerrado crea un riesgo inminente de electrocución, cortocircuito y posibles arcos eléctricos que pueden desencadenar incendios."
                        },
                        {
                          id: "h4",
                          type: "LOOSE_CABLES",
                          riskType: "Cables Sueltos",
                          name: "Cables Sueltos",
                          x: 74,
                          y: 65,
                          radius: 10,
                          penaltyPoints: 25,
                          justification: "Los cables sueltos colgando o tirados en el suelo representan un riesgo grave de tropiezo y caída, además de peligro eléctrico si llegan a entrar en contacto con agua o maquinaria."
                        }
                      ]
                    }
                  },
                }
                : undefined,
            })),
          },
        },
        include: {
          regulations: true,
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

    // Auto-enroll all admins in the newly created course
    const admins = await prisma.profile.findMany({ where: { role: "ADMIN" } });
    if (admins.length > 0) {
      await prisma.courseEnrollment.createMany({
        data: admins.map(admin => ({
          courseId: created.id,
          profileId: admin.id,
        })),
        skipDuplicates: true
      });
    }

    // hellish mapping to convert Date to string and fit the CourseResponse type
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      imageUrl: created.imageUrl,
      duration: created.duration,
      type: created.type,
      regulations: created.regulations.map((r: any) => ({ id: r.id, name: r.name })),
      isPublished: created.isPublished,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      enrolledWorkers: admins.length,
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
            passingScore: m.simulation.passingScore,
          }
          : undefined,
      })),
    };
  }

  async getAllCourses(): Promise<CourseResponse[]> {
    const courses = await prisma.course.findMany({
      include: {
        regulations: true,
        enrollments: true,
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
      duration: course.duration,
      type: course.type,
      regulations: course.regulations.map((r: any) => ({ id: r.id, name: r.name })),
      isPublished: course.isPublished,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      enrolledWorkers: course.enrollments.length,
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
        duration: true,
        type: true,
        regulations: true,
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
      duration: course.duration,
      type: course.type,
      regulations: course.regulations.map((r: any) => ({ id: r.id, name: r.name })),
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
        duration: true,
        type: true,
        regulations: true,
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
      duration: course.duration,
      type: course.type,
      regulations: course.regulations.map((r: any) => ({ id: r.id, name: r.name })),
      isPublished: course.isPublished,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
  }

}

export const courseService = new CourseService();
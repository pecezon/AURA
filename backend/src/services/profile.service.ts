import { Role } from "../../generated/prisma";
import { prisma } from "../config/prisma";

export async function ensureProfile(user: any) {
  let profile = await prisma.profile.findUnique({
    where: { id: user.id },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        id: user.id,
        email: user.email,
        role: Role.EMPLOYEE,
      },
    });
  }

  return profile;
}

export async function updateProfile(profileId: string, data: Partial<{ firstName: string; lastName: string; area: string; birthDate: string | null; employeeId: string }>) {
  const updated = await prisma.profile.update({
    where: { id: profileId },
    data,
  });
  return updated;
}

export async function getAllProfiles() {
  const profiles = await prisma.profile.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      employeeId: true,
      area: true,
      role: true,
      isProfileComplete: true,
      birthDate: true,
      createdAt: true,
    },
  });

  const profileIds = profiles.map((p) => p.id);

  // Batch query all simulation attempts
  const allSimAttempts = await prisma.simulationAttempt.findMany({
    where: { profileId: { in: profileIds } },
    include: { simulation: true },
    orderBy: { createdAt: "desc" },
  });

  // Batch query all quiz attempts
  const allQuizAttempts = await prisma.quizAttempt.findMany({
    where: { profileId: { in: profileIds } },
    orderBy: { createdAt: "desc" },
  });

  // Group attempts by profileId
  const simsByProfile = new Map<string, typeof allSimAttempts>();
  for (const attempt of allSimAttempts) {
    if (!simsByProfile.has(attempt.profileId)) {
      simsByProfile.set(attempt.profileId, []);
    }
    simsByProfile.get(attempt.profileId)!.push(attempt);
  }

  const quizzesByProfile = new Map<string, typeof allQuizAttempts>();
  for (const attempt of allQuizAttempts) {
    if (!quizzesByProfile.has(attempt.profileId)) {
      quizzesByProfile.set(attempt.profileId, []);
    }
    quizzesByProfile.get(attempt.profileId)!.push(attempt);
  }

  // Build the profile DTOs in-memory
  const profilesWithStats = profiles.map((profile) => {
    const simAttempts = simsByProfile.get(profile.id) || [];
    const quizAttempts = quizzesByProfile.get(profile.id) || [];
    const behavioralProfile = calculateBehavioralProfile(simAttempts, quizAttempts);

    return {
      id: profile.id,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      employeeId: profile.employeeId,
      area: profile.area,
      role: profile.role,
      isProfileComplete: profile.isProfileComplete,
      birthDate: profile.birthDate ? profile.birthDate.toISOString() : null,
      createdAt: profile.createdAt.toISOString(),
      behavioralProfile,
    };
  });

  return profilesWithStats;
}

export async function searchProfiles(search?: string, page: number = 1, limit: number = 20) {
  const where = search ? {
    OR: [
      { firstName: { contains: search, mode: 'insensitive' as const } },
      { lastName: { contains: search, mode: 'insensitive' as const } },
    ],
  } : {};

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        employeeId: true,
        area: true,
        role: true,
        isProfileComplete: true,
        birthDate: true,
        createdAt: true,
      },
    }),
    prisma.profile.count({ where }),
  ]);

  const data = profiles.map((profile) => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    employeeId: profile.employeeId,
    area: profile.area,
    role: profile.role,
    isProfileComplete: profile.isProfileComplete,
    birthDate: profile.birthDate ? profile.birthDate.toISOString() : null,
    createdAt: profile.createdAt.toISOString(),
  }));

  return {
    data,
    total,
    page,
    limit,
  };
}

export interface BehavioralProfileDTO {
  riskScore: number | null;
  reactionIndex: number | null;
  proceduralDiscipline: number | null;
}

export function calculateBehavioralProfile(
  simAttempts: any[],
  quizAttempts: any[]
): BehavioralProfileDTO | null {
  const latestSimsMap = new Map<string, any>();
  for (const attempt of simAttempts) {
    if (!latestSimsMap.has(attempt.simulationId)) {
      latestSimsMap.set(attempt.simulationId, attempt);
    }
  }
  const latestSims = Array.from(latestSimsMap.values());

  const latestQuizzesMap = new Map<string, any>();
  for (const attempt of quizAttempts) {
    if (!latestQuizzesMap.has(attempt.quizId)) {
      latestQuizzesMap.set(attempt.quizId, attempt);
    }
  }
  const latestQuizzes = Array.from(latestQuizzesMap.values());

  if (latestSims.length === 0 && latestQuizzes.length === 0) {
    return null;
  }

  let avgSimRiskScore = 0;
  let avgQuizScore = 0;
  const hasSims = latestSims.length > 0;
  const hasQuizzes = latestQuizzes.length > 0;

  if (hasSims) {
    const sum = latestSims.reduce((acc, s) => acc + s.riskScore, 0);
    avgSimRiskScore = sum / latestSims.length;
  }

  if (hasQuizzes) {
    const sum = latestQuizzes.reduce((acc, q) => acc + q.score, 0);
    avgQuizScore = sum / latestQuizzes.length;
  }

  let riskScore: number;
  if (hasSims && hasQuizzes) {
    riskScore = Math.round((0.7 * avgSimRiskScore) + (0.3 * avgQuizScore));
  } else if (hasSims) {
    riskScore = Math.round(avgSimRiskScore);
  } else {
    riskScore = Math.round(avgQuizScore);
  }

  let reactionIndex: number | null = null;
  let timeBoundedSimsCount = 0;
  let sumReactionScore = 0;

  for (const attempt of latestSims) {
    let config: any = attempt.simulation.configuration;
    if (typeof config === "string") {
      try {
        config = JSON.parse(config);
      } catch {
        config = {};
      }
    }
    
    const timeLimit = config?.timeLimitSeconds || config?.timeLimit || 120;

    let timeTaken = 0;
    const events = Array.isArray(attempt.events) ? (attempt.events as any[]) : [];
    const submitEvent = events.find(e => e?.type === "SUBMIT");
    if (submitEvent && submitEvent.timeTakenSeconds !== undefined) {
      timeTaken = submitEvent.timeTakenSeconds;
    } else if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      if (lastEvent && lastEvent.timestamp) {
        const timestampVal = typeof lastEvent.timestamp === "string" ? new Date(lastEvent.timestamp).getTime() : lastEvent.timestamp;
        const createdVal = attempt.createdAt instanceof Date ? attempt.createdAt.getTime() : new Date(attempt.createdAt).getTime();
        timeTaken = Math.max(0, (timestampVal - createdVal) / 1000);
      }
    }

    timeBoundedSimsCount++;
    if (timeTaken > timeLimit) {
      sumReactionScore += 0;
    } else {
      sumReactionScore += ((timeLimit - timeTaken) / timeLimit) * 100;
    }
  }

  if (timeBoundedSimsCount > 0) {
    reactionIndex = Math.round(sumReactionScore / timeBoundedSimsCount);
  }

  let evaluationAccSum = 0;
  let evalCount = 0;

  if (hasQuizzes) {
    const sum = latestQuizzes.reduce((acc, q) => acc + q.score, 0);
    evaluationAccSum += sum / latestQuizzes.length;
    evalCount++;
  }

  let simQuizAccSum = 0;
  let simQuizCount = 0;
  for (const attempt of latestSims) {
    let config: any = attempt.simulation.configuration;
    if (typeof config === "string") {
      try {
        config = JSON.parse(config);
      } catch {
        config = {};
      }
    }

    if (config?.simulationType === "GUIDED_SEQUENCE") {
      const totalHotspots = config?.hotspots?.length || 1;
      const events = Array.isArray(attempt.events) ? (attempt.events as any[]) : [];
      const quizErrors = events.filter(e => e?.type === "QUIZ_ERROR").length;
      const accuracy = Math.max(0, 1 - (quizErrors / totalHotspots)) * 100;
      simQuizAccSum += accuracy;
      simQuizCount++;
    }
  }

  if (simQuizCount > 0) {
    evaluationAccSum += simQuizAccSum / simQuizCount;
    evalCount++;
  }

  const evaluationAccuracy = evalCount > 0 ? (evaluationAccSum / evalCount) : 100;

  let proceduralPathSum = 0;
  let pathCount = 0;
  for (const attempt of latestSims) {
    const events = Array.isArray(attempt.events) ? (attempt.events as any[]) : [];
    const wrongClicks = events.filter(e => e?.type === "WRONG_CLICK").length;
    const removePins = events.filter(e => e?.type === "REMOVE_PIN").length;
    const attemptPathScore = Math.max(0, 100 - (wrongClicks * 5) - (removePins * 5));
    proceduralPathSum += attemptPathScore;
    pathCount++;
  }

  const pathAccuracy = pathCount > 0 ? (proceduralPathSum / pathCount) : 100;
  const proceduralDiscipline = Math.round((0.90 * evaluationAccuracy) + (0.10 * pathAccuracy));

  return {
    riskScore,
    reactionIndex,
    proceduralDiscipline,
  };
}

export async function getProfileById(id: string) {
  const profile = await prisma.profile.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      employeeId: true,
      area: true,
      role: true,
      isProfileComplete: true,
      birthDate: true,
      createdAt: true,
    },
  });
  if (!profile) return null;

  const simAttempts = await prisma.simulationAttempt.findMany({
    where: { profileId: id },
    include: { simulation: true },
    orderBy: { createdAt: "desc" }
  });

  const quizAttempts = await prisma.quizAttempt.findMany({
    where: { profileId: id },
    orderBy: { createdAt: "desc" }
  });

  const behavioralProfile = calculateBehavioralProfile(simAttempts, quizAttempts);

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    employeeId: profile.employeeId,
    area: profile.area,
    role: profile.role,
    isProfileComplete: profile.isProfileComplete,
    birthDate: profile.birthDate ? profile.birthDate.toISOString() : null,
    createdAt: profile.createdAt.toISOString(),
    behavioralProfile,
  };
}

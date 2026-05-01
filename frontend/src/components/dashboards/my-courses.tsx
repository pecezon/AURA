import React from "react";
import CourseCard from "./course-card";
import { useSessionId } from "@/hooks/useSession";
import { useProfileEnrollments } from "@/hooks/useEnrollments";

const translateCourseType = (type: string) => {
  if (type === "TECHNICAL") return "Técnico";
  if (type === "SECURITY") return "Seguridad";
  return type;
};

export const MyCourses: React.FC = () => {
  const profileId = useSessionId();

  const {
    data: enrollments = [],
    isLoading,
    error,
  } = useProfileEnrollments(profileId || "");

  if (isLoading) return <div className="p-4">Loading courses...</div>;
  if (error) return <div className="p-4">Error loading courses</div>;

  return (
    <div className="w-full flex flex-col pb-4 justify-center gap-4 md:gap-6 px-4 md:px-16">
      <h2 className="text-xl font-bold md:text-2xl">My Courses</h2>
      {enrollments.map((enrollment: any) => (
        <CourseCard
          key={enrollment.courseId}
          title={enrollment.courseTitle}
          description={enrollment.courseDescription ?? "No description"}
          regulations={enrollment.courseRegulations ?? []}
          type={translateCourseType(enrollment.courseType ?? "") || "Técnico"}
          duration={enrollment.courseDuration ?? "N/A"}
          progress={enrollment.progress ?? 0}
        />
      ))}
    </div>
  );
};

export default MyCourses;

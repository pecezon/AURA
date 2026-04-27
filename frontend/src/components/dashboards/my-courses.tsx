import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import CourseCard from "./course-card";
import { getUserId } from "@/lib/supabase";
import { useEffect, useState } from "react";

const fetchEnrollments = async (profileId: string) => {
  const response = await api.get(`/api/enrollments/${profileId}`);
  if (response.status !== 200) throw new Error("Failed to fetch enrollments");
  return response.data;
};

const translateCourseType = (type: string) => {
  if (type === "TECHNICAL") return "Técnico";
  if (type === "SECURITY") return "Seguridad";
  return type;
};

export const MyCourses: React.FC = () => {
  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    const loadProfileId = async () => {
      const id = await getUserId();
      setProfileId(id || "");
    };
    loadProfileId();
  }, []);

  const {
    data: enrollments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["enrollments", profileId],
    queryFn: () => fetchEnrollments(profileId),
    staleTime: 0.5 * 60 * 1000, // 30 seconds
    enabled: !!profileId,
  });

  if (isLoading) return <div className="p-4">Loading courses...</div>;
  if (error) return <div className="p-4">Error loading courses</div>;

  return (
    <div className="w-full flex flex-col pb-4 justify-center gap-4 md:gap-6 px-4 md:px-16">
      <h2 className="text-xl font-bold md:text-2xl">My Courses</h2>
      {enrollments.map((enrollment: any) => (
        <CourseCard
          key={enrollment.courseId}
          courseId={enrollment.courseId}
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

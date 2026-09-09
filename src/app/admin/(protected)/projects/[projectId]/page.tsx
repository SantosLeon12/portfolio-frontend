import {
  ProjectDetailsManager,
} from "@/features/projects/components/ProjectDetailsManager/ProjectDetailsManager";


type Props = {
  params: Promise<{
    projectId: string;
  }>;
};


export default async function ProjectDetailsPage({
  params,
}: Props) {
  const {
    projectId,
  } = await params;

  return (
    <ProjectDetailsManager
      projectId={
        Number(projectId)
      }
    />
  );
}
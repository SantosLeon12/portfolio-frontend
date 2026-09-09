import {
  ExperienceDetailsManager,
} from "@/features/professional/components/ExperienceDetailsManager/ExperienceDetailsManager";


type Props = {
  params: Promise<{
    experienceId: string;
  }>;
};


export default async function ExperienceDetailsPage({
  params,
}: Props) {
  const {
    experienceId,
  } = await params;

  return (
    <ExperienceDetailsManager
      experienceId={
        Number(
          experienceId,
        )
      }
    />
  );
}
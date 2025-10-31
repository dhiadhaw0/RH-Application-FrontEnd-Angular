export interface SkillAssessmentRequestDTO {
  userId: number;
  answers: { [key: string]: any };
}
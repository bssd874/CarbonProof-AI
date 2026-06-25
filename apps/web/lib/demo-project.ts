export const LEGACY_DEMO_PROJECT_ID = "demo-mangrove-restoration-bekasi";
export const PUBLIC_DEMO_PROJECT_ID = "1910e171-6a35-4255-b9fc-c15423c35b60";
export const PUBLIC_DEMO_PROOF_PATH = `/verify/${PUBLIC_DEMO_PROJECT_ID}`;

export function resolvePublicProjectId(projectId: string) {
  return projectId === LEGACY_DEMO_PROJECT_ID ? PUBLIC_DEMO_PROJECT_ID : projectId;
}

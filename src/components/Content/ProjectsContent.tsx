import { ProjectsFileExplorer } from './ProjectsFileExplorer';

export const ProjectsContent = ({ windowId }: { windowId?: string }) => {
    return (
        <ProjectsFileExplorer windowId={windowId} />
    );
};

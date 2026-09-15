import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";

type ReactProfilerProps = {
    id: string;
    children: ReactNode;
};

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
    console.log(`[Profiler] ${id}`, {
        phase,
        actualDuration,
        baseDuration
    });
};

export default function ReactProfiler({ id, children }: ReactProfilerProps) {
    if (!import.meta.env.DEV) return children;

    return (
        <Profiler
            id={id}
            onRender={onRender}
        >
            {children}
        </Profiler>
    );
}

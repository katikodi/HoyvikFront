import { Profiler, type ProfilerOnRenderCallback, type ReactNode } from "react";

type ReactProfilerProps = {
    id: string;
    children: ReactNode;
};

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
    if (actualDuration < 10) return;
    const level = actualDuration >= 16.67 ? "SLOW" : "NOTICE";
    console.info(
        `[React Profiler] ${level} ${id} — ${actualDuration.toFixed(2)}ms (${phase}) - baseDuration: ${baseDuration.toFixed(2)}ms`
    );
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

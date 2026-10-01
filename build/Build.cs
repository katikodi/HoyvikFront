using Fallout.Common;
using Fallout.Common.Tooling;

class Build : FalloutBuild
{
	public static int Main() => Execute<Build>(x => x.Publish);

	Target Frontend => _ => _
		.Executes(() =>
		{
			ProcessTasks
				.StartProcess(
					"npm",
					"--prefix ./frontend run build",
					RootDirectory)
				.AssertZeroExitCode();
		});

	Target Publish => _ => _
		.DependsOn(Frontend)
		.Executes(() =>
		{
			ProcessTasks
				.StartProcess(
					"aspire",
					"publish",
					RootDirectory / "backend" / "HoyvikProject.AppHost")
				.AssertZeroExitCode();
		});
}